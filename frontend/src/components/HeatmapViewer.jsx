import React, { useState } from 'react';

/**
 * ヒートマップビューアーコンポーネント
 */
const HeatmapViewer = ({ heatmaps, featureMatching }) => {
  const [activeTab, setActiveTab] = useState('overall');
  const [viewMode, setViewMode] = useState('comparison');

  if (!heatmaps) return null;

  const tabs = [
    { id: 'overall', label: '全体の差分', icon: '🎯' },
    { id: 'structure', label: '構図の差分', icon: '📐' },
    { id: 'feature', label: '特徴点マッチング', icon: '🔗' }
  ];

  const viewModes = [
    { id: 'comparison', label: '3画面比較' },
    { id: 'heatmap', label: 'ヒートマップ' },
    { id: 'overlay', label: 'オーバーレイ' }
  ];

  // 現在のタブの画像データを取得
  const getCurrentImage = () => {
    if (activeTab === 'feature') {
      return featureMatching?.match_image;
    }

    const currentHeatmap = heatmaps[activeTab];
    if (!currentHeatmap) return null;

    switch (viewMode) {
      case 'comparison':
        return currentHeatmap.comparison;
      case 'heatmap':
        return currentHeatmap.heatmap;
      case 'overlay':
        return currentHeatmap.overlay;
      default:
        return currentHeatmap.comparison;
    }
  };

  const currentImage = getCurrentImage();

  return (
    <div className="w-full space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2">
          差分の可視化
        </h2>
        <p className="text-sm text-gray-400">
          赤色が濃いほど差が大きい部分です
        </p>
      </div>

      {/* タブ切り替え */}
      <div className="flex justify-center space-x-2 flex-wrap">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id);
              if (tab.id === 'feature') {
                setViewMode('comparison');
              }
            }}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            <span className="mr-2">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* ビューモード切り替え（特徴点マッチング以外） */}
      {activeTab !== 'feature' && (
        <div className="flex justify-center space-x-2">
          {viewModes.map((mode) => (
            <button
              key={mode.id}
              onClick={() => setViewMode(mode.id)}
              className={`px-3 py-1 rounded text-sm font-medium transition-all ${
                viewMode === mode.id
                  ? 'bg-gray-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              {mode.label}
            </button>
          ))}
        </div>
      )}

      {/* 画像表示エリア */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        {currentImage ? (
          <div className="space-y-4">
            <img
              src={currentImage}
              alt="差分画像"
              className="w-full h-auto rounded shadow-lg"
            />
            
            {/* 説明テキスト */}
            <div className="text-sm text-gray-400 text-center">
              {activeTab === 'feature' ? (
                <div className="space-y-2">
                  <p>
                    <span className="font-semibold text-green-400">緑の線</span>：
                    対応する特徴点の組み合わせ
                  </p>
                  <p className="text-xs">
                    マッチング数: {featureMatching?.match_count || 0} / 
                    検出点: {featureMatching?.keypoints1_count || 0} × {featureMatching?.keypoints2_count || 0}
                  </p>
                  <p className="text-xs">
                    マッチングスコア: {featureMatching?.match_score || 0}%
                  </p>
                </div>
              ) : (
                <>
                  {viewMode === 'comparison' && (
                    <p>左から順に：画像1、画像2、差分ヒートマップ</p>
                  )}
                  {viewMode === 'heatmap' && (
                    <p>赤：差が大きい、青：差が小さい</p>
                  )}
                  {viewMode === 'overlay' && (
                    <p>元画像に差分を重ねて表示</p>
                  )}
                </>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            画像データがありません
          </div>
        )}
      </div>

      {/* 凡例 */}
      {activeTab !== 'feature' && (
        <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
          <h3 className="text-sm font-semibold text-white mb-3">
            ヒートマップの見方
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: '#ef4444' }}></div>
              <span className="text-gray-300">大きな差</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: '#f97316' }}></div>
              <span className="text-gray-300">やや大きな差</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: '#eab308' }}></div>
              <span className="text-gray-300">中程度の差</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: '#22c55e' }}></div>
              <span className="text-gray-300">小さな差</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HeatmapViewer;

