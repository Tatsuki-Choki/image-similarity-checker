"""
ヒートマップ生成モジュール
画像間の差分を視覚化したヒートマップを生成
"""
import cv2
import numpy as np
import base64
from io import BytesIO
from PIL import Image


def create_heatmap(diff: np.ndarray, colormap: int = cv2.COLORMAP_JET) -> np.ndarray:
    """
    差分マップからヒートマップを生成
    
    Args:
        diff: 差分マップ（0-1の範囲）
        colormap: OpenCVのカラーマップ（デフォルト: JET）
    
    Returns:
        カラーヒートマップ画像（BGR）
    """
    # 差分を0-255の範囲に変換（逆転：差が大きい=赤）
    diff_normalized = (1.0 - diff) * 255
    diff_uint8 = diff_normalized.astype(np.uint8)
    
    # カラーマップを適用
    heatmap = cv2.applyColorMap(diff_uint8, colormap)
    
    return heatmap


def overlay_heatmap(img: np.ndarray, heatmap: np.ndarray, alpha: float = 0.5) -> np.ndarray:
    """
    元画像にヒートマップをオーバーレイ
    
    Args:
        img: 元画像（BGR）
        heatmap: ヒートマップ（BGR）
        alpha: ヒートマップの透明度（0-1）
    
    Returns:
        オーバーレイされた画像
    """
    # 同じサイズに調整
    if img.shape != heatmap.shape:
        heatmap = cv2.resize(heatmap, (img.shape[1], img.shape[0]))
    
    # アルファブレンディング
    overlayed = cv2.addWeighted(img, 1 - alpha, heatmap, alpha, 0)
    
    return overlayed


def create_comparison_view(img1: np.ndarray, img2: np.ndarray, heatmap: np.ndarray) -> np.ndarray:
    """
    3枚の画像を横に並べた比較ビューを作成
    
    Args:
        img1: 1枚目の画像
        img2: 2枚目の画像
        heatmap: ヒートマップ
    
    Returns:
        3枚を横に並べた画像
    """
    # すべて同じ高さに調整
    height = img1.shape[0]
    
    if img2.shape[0] != height:
        img2 = cv2.resize(img2, (int(img2.shape[1] * height / img2.shape[0]), height))
    
    if heatmap.shape[0] != height:
        heatmap = cv2.resize(heatmap, (int(heatmap.shape[1] * height / heatmap.shape[0]), height))
    
    # 横に連結
    comparison = np.hstack([img1, img2, heatmap])
    
    return comparison


def image_to_base64(img: np.ndarray, format: str = "PNG") -> str:
    """
    画像をBase64エンコードされた文字列に変換
    
    Args:
        img: 画像（BGR）
        format: 画像フォーマット（PNG, JPEG等）
    
    Returns:
        Base64エンコードされた文字列
    """
    # BGRからRGBに変換
    img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    
    # PILイメージに変換
    pil_img = Image.fromarray(img_rgb)
    
    # バイトストリームに保存
    buffered = BytesIO()
    pil_img.save(buffered, format=format)
    
    # Base64エンコード
    img_base64 = base64.b64encode(buffered.getvalue()).decode('utf-8')
    
    return f"data:image/{format.lower()};base64,{img_base64}"


def generate_heatmap_images(diff: np.ndarray, img1: np.ndarray, img2: np.ndarray) -> dict:
    """
    各種ヒートマップ画像を生成
    
    Args:
        diff: 差分マップ
        img1: 1枚目の画像
        img2: 2枚目の画像
    
    Returns:
        Base64エンコードされたヒートマップ画像の辞書
    """
    # ヒートマップを生成
    heatmap = create_heatmap(diff)
    
    # オーバーレイ画像を生成（画像1にヒートマップを重ねる）
    overlay = overlay_heatmap(img1, heatmap, alpha=0.4)
    
    # 比較ビューを生成
    comparison = create_comparison_view(img1, img2, heatmap)
    
    return {
        "heatmap": image_to_base64(heatmap),
        "overlay": image_to_base64(overlay),
        "comparison": image_to_base64(comparison)
    }

