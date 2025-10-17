import React from 'react';

/**
 * ローディングスピナーコンポーネント
 */
const LoadingSpinner = ({ message = '処理中...' }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-8 shadow-2xl border border-gray-700 max-w-md w-full mx-4">
        <div className="flex flex-col items-center space-y-4">
          {/* スピナー */}
          <div className="relative">
            <div className="w-16 h-16 border-4 border-gray-600 border-t-blue-500 rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 bg-blue-500 rounded-full animate-pulse"></div>
            </div>
          </div>

          {/* メッセージ */}
          <div className="text-center space-y-2">
            <p className="text-lg font-semibold text-white">
              {message}
            </p>
            <p className="text-sm text-gray-400">
              画像を分析しています...
            </p>
          </div>

          {/* プログレスバー */}
          <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-full rounded-full animate-pulse"></div>
          </div>

          {/* 予想時間 */}
          <p className="text-xs text-gray-500">
            通常10〜15秒程度かかります
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;

