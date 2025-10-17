import React from 'react';
import SimilarityScores from './SimilarityScores';
import HeatmapViewer from './HeatmapViewer';

/**
 * 結果表示コンポーネント
 */
const ResultDisplay = ({ result }) => {
  if (!result) return null;

  return (
    <div className="w-full space-y-8 animate-fadeIn">
      {/* 類似度スコア */}
      <SimilarityScores scores={result.similarity_scores} />

      {/* ヒートマップと特徴点マッチング */}
      <HeatmapViewer 
        heatmaps={result.heatmaps} 
        featureMatching={result.feature_matching}
      />

      {/* ダウンロードボタン（将来的な拡張用） */}
      <div className="text-center">
        <button
          onClick={() => {
            const resultText = `
画像類似度チェック結果

全体類似度: ${result.similarity_scores.overall_similarity}%
色合い類似度: ${result.similarity_scores.color_similarity}%
構図類似度: ${result.similarity_scores.structure_similarity}%

特徴点マッチング:
- マッチング数: ${result.feature_matching.match_count}
- 検出点1: ${result.feature_matching.keypoints1_count}
- 検出点2: ${result.feature_matching.keypoints2_count}
- マッチングスコア: ${result.feature_matching.match_score}%
`;
            const blob = new Blob([resultText], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'similarity_result.txt';
            a.click();
            URL.revokeObjectURL(url);
          }}
          className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-all shadow-lg"
        >
          📄 結果をテキストで保存
        </button>
      </div>
    </div>
  );
};

export default ResultDisplay;

