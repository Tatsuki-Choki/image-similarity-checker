import React from 'react';

/**
 * 円形プログレスバーコンポーネント
 */
const CircularProgress = ({ value, size = 120, strokeWidth = 8, color }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (value / 100) * circumference;

  // スコアに応じた色を決定
  const getColor = () => {
    if (color) return color;
    if (value >= 80) return '#22c55e'; // 緑
    if (value >= 60) return '#eab308'; // 黄
    if (value >= 40) return '#f97316'; // オレンジ
    return '#ef4444'; // 赤
  };

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        {/* 背景の円 */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          className="text-gray-700"
        />
        {/* プログレスの円 */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={getColor()}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute text-center">
        <span className="text-2xl font-bold" style={{ color: getColor() }}>
          {value.toFixed(1)}%
        </span>
      </div>
    </div>
  );
};

/**
 * 類似度スコア表示コンポーネント
 */
const SimilarityScores = ({ scores }) => {
  if (!scores) return null;

  const scoreItems = [
    {
      key: 'overall_similarity',
      label: '全体類似度',
      description: 'SSIM（構造的類似性）による総合評価',
      icon: '🎯'
    },
    {
      key: 'color_similarity',
      label: '色合い類似度',
      description: 'HSV色空間でのヒストグラム比較',
      icon: '🎨'
    },
    {
      key: 'structure_similarity',
      label: '構図類似度',
      description: 'エッジ検出による構造比較',
      icon: '📐'
    }
  ];

  return (
    <div className="w-full space-y-6">
      <h2 className="text-2xl font-bold text-white text-center">
        類似度分析結果
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {scoreItems.map((item) => (
          <div
            key={item.key}
            className="bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-700 hover:border-gray-600 transition-all"
          >
            <div className="flex flex-col items-center space-y-4">
              {/* アイコンとラベル */}
              <div className="text-center">
                <div className="text-4xl mb-2">{item.icon}</div>
                <h3 className="text-lg font-semibold text-white">
                  {item.label}
                </h3>
                <p className="text-xs text-gray-400 mt-1">
                  {item.description}
                </p>
              </div>

              {/* 円形プログレスバー */}
              <CircularProgress value={scores[item.key]} />

              {/* 評価コメント */}
              <div className="text-center">
                <p className="text-sm text-gray-300">
                  {getEvaluation(scores[item.key])}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 総合評価 */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-lg p-6 border border-gray-700">
        <h3 className="text-xl font-semibold text-white mb-3 text-center">
          総合評価
        </h3>
        <div className="text-center">
          <p className="text-gray-300 leading-relaxed">
            {getOverallEvaluation(scores)}
          </p>
        </div>
      </div>
    </div>
  );
};

/**
 * スコアに基づいた評価コメントを返す
 */
const getEvaluation = (score) => {
  if (score >= 90) return '極めて高い類似性';
  if (score >= 80) return '非常に高い類似性';
  if (score >= 70) return '高い類似性';
  if (score >= 60) return 'やや高い類似性';
  if (score >= 50) return '中程度の類似性';
  if (score >= 40) return 'やや低い類似性';
  if (score >= 30) return '低い類似性';
  return '非常に低い類似性';
};

/**
 * 総合的な評価コメントを返す
 */
const getOverallEvaluation = (scores) => {
  const avg = (scores.overall_similarity + scores.color_similarity + scores.structure_similarity) / 3;

  if (avg >= 80) {
    return '2枚の画像は非常に似ています。トレースまたは同一画像の可能性が高いです。';
  } else if (avg >= 70) {
    return '2枚の画像は似ています。一部の要素が共通している可能性があります。';
  } else if (avg >= 60) {
    return '2枚の画像にはいくつかの共通要素が見られますが、明確な違いもあります。';
  } else if (avg >= 50) {
    return '2枚の画像は部分的に似ていますが、全体的には異なります。';
  } else {
    return '2枚の画像は大きく異なります。独立した画像と考えられます。';
  }
};

export default SimilarityScores;

