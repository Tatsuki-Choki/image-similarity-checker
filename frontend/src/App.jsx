import React, { useState } from 'react';
import ImageUploader from './components/ImageUploader';
import ResultDisplay from './components/ResultDisplay';
import LoadingSpinner from './components/LoadingSpinner';
import { compareImages } from './api';

function App() {
  const [image1, setImage1] = useState(null);
  const [image2, setImage2] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  // 比較処理を実行
  const handleCompare = async () => {
    // バリデーション
    if (!image1 || !image2) {
      setError('2枚の画像を選択してください');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await compareImages(image1, image2);
      setResult(data);
      
      // 結果までスムーズにスクロール
      setTimeout(() => {
        document.getElementById('result-section')?.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }, 100);
    } catch (err) {
      setError(err.message);
      console.error('Comparison error:', err);
    } finally {
      setLoading(false);
    }
  };

  // リセット処理
  const handleReset = () => {
    setImage1(null);
    setImage2(null);
    setResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* ローディング表示 */}
      {loading && <LoadingSpinner />}

      {/* ヘッダー */}
      <header className="bg-gray-800 shadow-lg border-b border-gray-700">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-white text-center">
            🎨 画像類似度チェッカー
          </h1>
          <p className="text-gray-400 text-center mt-2">
            YouTubeサムネイル画像のトレース判定ツール
          </p>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* 画像アップロードセクション */}
        <section className="bg-gray-800 rounded-lg p-6 shadow-xl border border-gray-700">
          <h2 className="text-xl font-semibold text-white mb-6 text-center">
            比較する画像を選択
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ImageUploader
              label="画像1"
              onImageSelect={setImage1}
              selectedImage={image1}
            />
            <ImageUploader
              label="画像2"
              onImageSelect={setImage2}
              selectedImage={image2}
            />
          </div>

          {/* エラー表示 */}
          {error && (
            <div className="mt-6 bg-red-900/30 border border-red-700 rounded-lg p-4">
              <p className="text-red-400 text-center">
                ⚠️ {error}
              </p>
            </div>
          )}

          {/* 操作ボタン */}
          <div className="mt-6 flex justify-center space-x-4">
            <button
              onClick={handleCompare}
              disabled={!image1 || !image2 || loading}
              className={`px-8 py-3 rounded-lg font-semibold text-white transition-all shadow-lg
                ${!image1 || !image2 || loading
                  ? 'bg-gray-600 cursor-not-allowed opacity-50'
                  : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transform hover:scale-105'
                }`}
            >
              {loading ? '処理中...' : '🔍 類似度をチェック'}
            </button>

            {(image1 || image2 || result) && (
              <button
                onClick={handleReset}
                disabled={loading}
                className="px-8 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-semibold transition-all shadow-lg"
              >
                🔄 リセット
              </button>
            )}
          </div>
        </section>

        {/* 使い方セクション */}
        {!result && (
          <section className="bg-gray-800 rounded-lg p-6 shadow-xl border border-gray-700">
            <h2 className="text-xl font-semibold text-white mb-4">
              使い方
            </h2>
            <ol className="list-decimal list-inside space-y-2 text-gray-300">
              <li>比較したい2枚の画像（JPEG、PNG形式）を選択します</li>
              <li>「類似度をチェック」ボタンをクリックします</li>
              <li>3つの指標（全体、色合い、構図）で類似度が表示されます</li>
              <li>差分ヒートマップで具体的な違いを確認できます</li>
              <li>特徴点マッチングで対応する部分を視覚的に確認できます</li>
            </ol>

            <div className="mt-6 bg-blue-900/20 border border-blue-700 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-blue-400 mb-2">
                💡 評価指標について
              </h3>
              <ul className="text-sm text-gray-400 space-y-1">
                <li><strong>全体類似度：</strong>SSIM（構造的類似性インデックス）で画像全体の類似性を評価</li>
                <li><strong>色合い類似度：</strong>HSV色空間でのヒストグラム比較により色彩の類似性を評価</li>
                <li><strong>構図類似度：</strong>エッジ検出により輪郭や配置の類似性を評価</li>
              </ul>
            </div>
          </section>
        )}

        {/* 結果表示セクション */}
        {result && (
          <section id="result-section" className="scroll-mt-8">
            <ResultDisplay result={result} />
          </section>
        )}
      </main>

      {/* フッター */}
      <footer className="bg-gray-800 border-t border-gray-700 mt-12">
        <div className="container mx-auto px-4 py-6 text-center text-gray-400 text-sm">
          <p>画像類似度チェッカー v1.0.0</p>
          <p className="mt-1">
            Powered by FastAPI + React + OpenCV
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;

