"""
特徴点マッチングモジュール
ORB検出器を使用して2枚の画像間の特徴点を検出・マッチング
"""
import cv2
import numpy as np
from typing import Tuple, List


def detect_and_match_features(img1: np.ndarray, img2: np.ndarray, max_features: int = 500) -> Tuple[List, np.ndarray, np.ndarray]:
    """
    ORBを使用して特徴点を検出し、マッチング
    
    Args:
        img1: 1枚目の画像（BGR）
        img2: 2枚目の画像（BGR）
        max_features: 検出する最大特徴点数
    
    Returns:
        良好なマッチのリスト、キーポイント1、キーポイント2
    """
    # グレースケールに変換
    gray1 = cv2.cvtColor(img1, cv2.COLOR_BGR2GRAY)
    gray2 = cv2.cvtColor(img2, cv2.COLOR_BGR2GRAY)
    
    # ORB検出器を作成
    orb = cv2.ORB_create(nfeatures=max_features)
    
    # 特徴点とディスクリプタを検出
    keypoints1, descriptors1 = orb.detectAndCompute(gray1, None)
    keypoints2, descriptors2 = orb.detectAndCompute(gray2, None)
    
    # 特徴点が検出されなかった場合
    if descriptors1 is None or descriptors2 is None:
        return [], keypoints1, keypoints2
    
    # BFMatcherでマッチング
    bf = cv2.BFMatcher(cv2.NORM_HAMMING, crossCheck=True)
    matches = bf.match(descriptors1, descriptors2)
    
    # 距離でソート
    matches = sorted(matches, key=lambda x: x.distance)
    
    # 良好なマッチのみを抽出（上位50%）
    good_matches = matches[:int(len(matches) * 0.5)]
    
    return good_matches, keypoints1, keypoints2


def draw_matches_image(img1: np.ndarray, img2: np.ndarray, 
                       keypoints1: List, keypoints2: List, 
                       matches: List, max_matches: int = 50) -> np.ndarray:
    """
    マッチング結果を可視化した画像を生成
    
    Args:
        img1: 1枚目の画像（BGR）
        img2: 2枚目の画像（BGR）
        keypoints1: 1枚目の画像のキーポイント
        keypoints2: 2枚目の画像のキーポイント
        matches: マッチのリスト
        max_matches: 描画する最大マッチ数
    
    Returns:
        マッチング結果が描画された画像
    """
    # 描画するマッチ数を制限
    matches_to_draw = matches[:min(len(matches), max_matches)]
    
    # マッチング結果を描画
    match_img = cv2.drawMatches(
        img1, keypoints1,
        img2, keypoints2,
        matches_to_draw,
        None,
        matchColor=(0, 255, 0),  # 緑色の線
        singlePointColor=(255, 0, 0),  # 青色の点
        flags=cv2.DrawMatchesFlags_NOT_DRAW_SINGLE_POINTS
    )
    
    return match_img


def calculate_match_score(matches: List, keypoints1: List, keypoints2: List) -> float:
    """
    マッチングスコアを計算（0-1の範囲）
    
    Args:
        matches: マッチのリスト
        keypoints1: 1枚目の画像のキーポイント
        keypoints2: 2枚目の画像のキーポイント
    
    Returns:
        マッチングスコア（0-1）
    """
    if len(keypoints1) == 0 or len(keypoints2) == 0:
        return 0.0
    
    # マッチ率を計算
    min_keypoints = min(len(keypoints1), len(keypoints2))
    match_ratio = len(matches) / min_keypoints if min_keypoints > 0 else 0.0
    
    # 平均マッチング距離を計算（正規化）
    if len(matches) > 0:
        avg_distance = sum([m.distance for m in matches]) / len(matches)
        # ORBの距離は通常0-256の範囲なので正規化
        distance_score = 1.0 - min(avg_distance / 256.0, 1.0)
    else:
        distance_score = 0.0
    
    # 総合スコア（マッチ率50%、距離スコア50%）
    final_score = 0.5 * match_ratio + 0.5 * distance_score
    
    return min(final_score, 1.0)


def generate_feature_matching(img1: np.ndarray, img2: np.ndarray) -> dict:
    """
    特徴点マッチングを実行し、結果を返す
    
    Args:
        img1: 1枚目の画像（BGR）
        img2: 2枚目の画像（BGR）
    
    Returns:
        マッチング結果の辞書
    """
    # 特徴点検出とマッチング
    matches, keypoints1, keypoints2 = detect_and_match_features(img1, img2)
    
    # マッチング画像を生成
    if len(matches) > 0:
        match_img = draw_matches_image(img1, img2, keypoints1, keypoints2, matches)
    else:
        # マッチがない場合は2つの画像を横に並べるだけ
        height = max(img1.shape[0], img2.shape[0])
        img1_resized = cv2.resize(img1, (int(img1.shape[1] * height / img1.shape[0]), height))
        img2_resized = cv2.resize(img2, (int(img2.shape[1] * height / img2.shape[0]), height))
        match_img = np.hstack([img1_resized, img2_resized])
    
    # マッチングスコアを計算
    match_score = calculate_match_score(matches, keypoints1, keypoints2)
    
    return {
        "match_count": len(matches),
        "keypoints1_count": len(keypoints1),
        "keypoints2_count": len(keypoints2),
        "match_score": float(match_score),
        "match_image": match_img
    }

