"""
FastAPI メインアプリケーション
画像類似度チェッカーのAPIエンドポイント
"""
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import cv2
import numpy as np
from typing import List
import io

from .similarity import compare_images
from .heatmap import generate_heatmap_images, image_to_base64
from .feature_matching import generate_feature_matching


app = FastAPI(
    title="Image Similarity Checker API",
    description="YouTubeサムネイル画像の類似度をチェックするAPI",
    version="1.0.0"
)

# CORS設定
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:5173",
        "https://*.vercel.app",
        "*"  # 開発時は全て許可（本番環境では特定のドメインのみに制限）
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def read_image_file(file: UploadFile) -> np.ndarray:
    """
    アップロードされたファイルを読み込んでOpenCV画像に変換
    
    Args:
        file: アップロードされた画像ファイル
    
    Returns:
        OpenCV画像（BGR）
    
    Raises:
        HTTPException: 画像の読み込みに失敗した場合
    """
    try:
        # ファイルをバイトとして読み込み
        contents = file.file.read()
        
        # NumPy配列に変換
        nparr = np.frombuffer(contents, np.uint8)
        
        # OpenCV画像にデコード
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        if img is None:
            raise ValueError("画像のデコードに失敗しました")
        
        return img
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"画像の読み込みに失敗しました: {str(e)}")


@app.get("/")
async def root():
    """
    ルートエンドポイント
    """
    return {
        "message": "Image Similarity Checker API",
        "version": "1.0.0",
        "endpoints": {
            "compare": "/api/compare",
            "health": "/health"
        }
    }


@app.get("/health")
async def health_check():
    """
    ヘルスチェックエンドポイント
    """
    return {"status": "healthy"}


@app.post("/api/compare")
async def compare_images_endpoint(
    image1: UploadFile = File(..., description="1枚目の画像"),
    image2: UploadFile = File(..., description="2枚目の画像")
):
    """
    2枚の画像を比較し、類似度を計算
    
    Args:
        image1: 1枚目の画像ファイル
        image2: 2枚目の画像ファイル
    
    Returns:
        類似度スコアとヒートマップ画像
    """
    # ファイル形式の検証
    allowed_types = ["image/jpeg", "image/jpg", "image/png"]
    if image1.content_type not in allowed_types or image2.content_type not in allowed_types:
        raise HTTPException(
            status_code=400,
            detail=f"サポートされていないファイル形式です。JPEG または PNG を使用してください。"
        )
    
    try:
        # 画像を読み込み
        img1 = read_image_file(image1)
        img2 = read_image_file(image2)
        
        # 類似度を計算
        similarity_results = compare_images(img1, img2)
        
        # ヒートマップを生成
        heatmap_images = generate_heatmap_images(
            similarity_results["overall_diff"],
            similarity_results["img1_resized"],
            similarity_results["img2_resized"]
        )
        
        # 構図の差分ヒートマップも生成
        structure_heatmap_images = generate_heatmap_images(
            similarity_results["structure_diff"],
            similarity_results["img1_resized"],
            similarity_results["img2_resized"]
        )
        
        # 特徴点マッチングを実行
        feature_results = generate_feature_matching(
            similarity_results["img1_resized"],
            similarity_results["img2_resized"]
        )
        
        # マッチング画像をBase64に変換
        feature_match_base64 = image_to_base64(feature_results["match_image"])
        
        # 結果を返す
        return {
            "success": True,
            "similarity_scores": {
                "overall_similarity": round(similarity_results["overall_similarity"] * 100, 2),
                "color_similarity": round(similarity_results["color_similarity"] * 100, 2),
                "structure_similarity": round(similarity_results["structure_similarity"] * 100, 2)
            },
            "heatmaps": {
                "overall": {
                    "heatmap": heatmap_images["heatmap"],
                    "overlay": heatmap_images["overlay"],
                    "comparison": heatmap_images["comparison"]
                },
                "structure": {
                    "heatmap": structure_heatmap_images["heatmap"],
                    "overlay": structure_heatmap_images["overlay"],
                    "comparison": structure_heatmap_images["comparison"]
                }
            },
            "feature_matching": {
                "match_count": feature_results["match_count"],
                "keypoints1_count": feature_results["keypoints1_count"],
                "keypoints2_count": feature_results["keypoints2_count"],
                "match_score": round(feature_results["match_score"] * 100, 2),
                "match_image": feature_match_base64
            }
        }
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"処理中にエラーが発生しました: {str(e)}")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

