/**
 * バックエンドAPI通信モジュール
 */
import axios from 'axios';

// APIのベースURL（環境変数から取得、デフォルトはローカル）
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

/**
 * 2枚の画像を比較
 * @param {File} image1 - 1枚目の画像ファイル
 * @param {File} image2 - 2枚目の画像ファイル
 * @returns {Promise<Object>} - 類似度スコアとヒートマップ
 */
export const compareImages = async (image1, image2) => {
  try {
    // FormDataを作成
    const formData = new FormData();
    formData.append('image1', image1);
    formData.append('image2', image2);

    // APIリクエスト
    const response = await axios.post(`${API_BASE_URL}/api/compare`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      // タイムアウトを30秒に設定（画像処理は時間がかかる）
      timeout: 30000,
    });

    return response.data;
  } catch (error) {
    console.error('API Error:', error);
    
    if (error.response) {
      // サーバーからのエラーレスポンス
      throw new Error(error.response.data.detail || 'サーバーエラーが発生しました');
    } else if (error.request) {
      // リクエストが送信されたがレスポンスがない
      throw new Error('サーバーに接続できません。バックエンドが起動しているか確認してください。');
    } else {
      // その他のエラー
      throw new Error('エラーが発生しました: ' + error.message);
    }
  }
};

/**
 * ヘルスチェック
 * @returns {Promise<Object>} - サーバーの状態
 */
export const healthCheck = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/health`);
    return response.data;
  } catch (error) {
    console.error('Health check failed:', error);
    return { status: 'unhealthy' };
  }
};

