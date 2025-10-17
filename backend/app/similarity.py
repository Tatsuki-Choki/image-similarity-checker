"""
画像類似度計算モジュール
SSIM、HSVヒストグラム、エッジ検出による構図類似度を計算
"""
import cv2
import numpy as np
from skimage.metrics import structural_similarity as ssim
from typing import Tuple


def resize_images(img1: np.ndarray, img2: np.ndarray, target_size: Tuple[int, int] = (800, 600)) -> Tuple[np.ndarray, np.ndarray]:
    """
    2枚の画像を同じサイズにリサイズ
    
    Args:
        img1: 1枚目の画像
        img2: 2枚目の画像
        target_size: リサイズ後のサイズ (width, height)
    
    Returns:
        リサイズされた2枚の画像
    """
    img1_resized = cv2.resize(img1, target_size, interpolation=cv2.INTER_AREA)
    img2_resized = cv2.resize(img2, target_size, interpolation=cv2.INTER_AREA)
    return img1_resized, img2_resized


def calculate_overall_similarity(img1: np.ndarray, img2: np.ndarray) -> Tuple[float, np.ndarray]:
    """
    全体的な類似度をSSIMで計算
    
    Args:
        img1: 1枚目の画像（BGR）
        img2: 2枚目の画像（BGR）
    
    Returns:
        SSIMスコア (0-1) と差分マップ
    """
    # グレースケールに変換
    gray1 = cv2.cvtColor(img1, cv2.COLOR_BGR2GRAY)
    gray2 = cv2.cvtColor(img2, cv2.COLOR_BGR2GRAY)
    
    # SSIMを計算
    score, diff = ssim(gray1, gray2, full=True)
    
    return score, diff


def calculate_color_similarity(img1: np.ndarray, img2: np.ndarray) -> float:
    """
    色合いの類似度をHSVヒストグラムで計算
    
    Args:
        img1: 1枚目の画像（BGR）
        img2: 2枚目の画像（BGR）
    
    Returns:
        色合いの類似度スコア (0-1)
    """
    # HSV色空間に変換
    hsv1 = cv2.cvtColor(img1, cv2.COLOR_BGR2HSV)
    hsv2 = cv2.cvtColor(img2, cv2.COLOR_BGR2HSV)
    
    # 各チャンネルのヒストグラムを計算
    # H (色相): 0-179, S (彩度): 0-255, V (明度): 0-255
    hist_h1 = cv2.calcHist([hsv1], [0], None, [180], [0, 180])
    hist_h2 = cv2.calcHist([hsv2], [0], None, [180], [0, 180])
    
    hist_s1 = cv2.calcHist([hsv1], [1], None, [256], [0, 256])
    hist_s2 = cv2.calcHist([hsv2], [1], None, [256], [0, 256])
    
    hist_v1 = cv2.calcHist([hsv1], [2], None, [256], [0, 256])
    hist_v2 = cv2.calcHist([hsv2], [2], None, [256], [0, 256])
    
    # 正規化
    cv2.normalize(hist_h1, hist_h1, alpha=0, beta=1, norm_type=cv2.NORM_MINMAX)
    cv2.normalize(hist_h2, hist_h2, alpha=0, beta=1, norm_type=cv2.NORM_MINMAX)
    cv2.normalize(hist_s1, hist_s1, alpha=0, beta=1, norm_type=cv2.NORM_MINMAX)
    cv2.normalize(hist_s2, hist_s2, alpha=0, beta=1, norm_type=cv2.NORM_MINMAX)
    cv2.normalize(hist_v1, hist_v1, alpha=0, beta=1, norm_type=cv2.NORM_MINMAX)
    cv2.normalize(hist_v2, hist_v2, alpha=0, beta=1, norm_type=cv2.NORM_MINMAX)
    
    # 相関係数で比較（CORREL method）
    corr_h = cv2.compareHist(hist_h1, hist_h2, cv2.HISTCMP_CORREL)
    corr_s = cv2.compareHist(hist_s1, hist_s2, cv2.HISTCMP_CORREL)
    corr_v = cv2.compareHist(hist_v1, hist_v2, cv2.HISTCMP_CORREL)
    
    # 重み付け平均（色相を重視）
    # 色相: 50%, 彩度: 30%, 明度: 20%
    similarity = 0.5 * corr_h + 0.3 * corr_s + 0.2 * corr_v
    
    # -1〜1の範囲を0〜1に正規化
    similarity = (similarity + 1) / 2
    
    return similarity


def calculate_structure_similarity(img1: np.ndarray, img2: np.ndarray) -> Tuple[float, np.ndarray]:
    """
    構図の類似度をエッジ検出＋SSIMで計算
    
    Args:
        img1: 1枚目の画像（BGR）
        img2: 2枚目の画像（BGR）
    
    Returns:
        構図の類似度スコア (0-1) と差分マップ
    """
    # グレースケールに変換
    gray1 = cv2.cvtColor(img1, cv2.COLOR_BGR2GRAY)
    gray2 = cv2.cvtColor(img2, cv2.COLOR_BGR2GRAY)
    
    # Cannyエッジ検出
    edges1 = cv2.Canny(gray1, 100, 200)
    edges2 = cv2.Canny(gray2, 100, 200)
    
    # エッジ画像のSSIMを計算
    score, diff = ssim(edges1, edges2, full=True)
    
    return score, diff


def compare_images(img1: np.ndarray, img2: np.ndarray) -> dict:
    """
    2枚の画像を比較し、3つの類似度指標を計算
    
    Args:
        img1: 1枚目の画像（BGR）
        img2: 2枚目の画像（BGR）
    
    Returns:
        類似度スコアと差分マップを含む辞書
    """
    # 画像のリサイズ
    img1_resized, img2_resized = resize_images(img1, img2)
    
    # 全体類似度
    overall_score, overall_diff = calculate_overall_similarity(img1_resized, img2_resized)
    
    # 色合い類似度
    color_score = calculate_color_similarity(img1_resized, img2_resized)
    
    # 構図類似度
    structure_score, structure_diff = calculate_structure_similarity(img1_resized, img2_resized)
    
    return {
        "overall_similarity": float(overall_score),
        "color_similarity": float(color_score),
        "structure_similarity": float(structure_score),
        "overall_diff": overall_diff,
        "structure_diff": structure_diff,
        "img1_resized": img1_resized,
        "img2_resized": img2_resized
    }

