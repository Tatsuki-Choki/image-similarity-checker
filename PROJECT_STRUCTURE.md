# プロジェクト構造

## ディレクトリ構成

```
サムネ採点/
│
├── backend/                    # バックエンド（FastAPI）
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py            # FastAPIアプリケーションのエントリーポイント
│   │   ├── similarity.py      # 類似度計算ロジック（SSIM、HSV、エッジ検出）
│   │   ├── heatmap.py         # ヒートマップ生成と画像エンコーディング
│   │   └── feature_matching.py # ORB特徴点マッチング
│   ├── requirements.txt        # Python依存パッケージ
│   ├── Dockerfile             # Dockerコンテナ設定
│   ├── render.yaml            # Renderデプロイ設定
│   └── README.md              # バックエンドドキュメント
│
├── frontend/                   # フロントエンド（React + Vite）
│   ├── src/
│   │   ├── components/
│   │   │   ├── ImageUploader.jsx      # 画像アップロードコンポーネント
│   │   │   ├── SimilarityScores.jsx   # 類似度スコア表示（円形プログレスバー）
│   │   │   ├── HeatmapViewer.jsx      # ヒートマップビューアー（タブ切り替え）
│   │   │   ├── ResultDisplay.jsx      # 結果表示コンポーネント
│   │   │   └── LoadingSpinner.jsx     # ローディング表示
│   │   ├── App.jsx            # メインアプリケーションコンポーネント
│   │   ├── api.js             # バックエンドAPI通信モジュール
│   │   ├── main.jsx           # Reactエントリーポイント
│   │   └── index.css          # グローバルスタイル（TailwindCSS）
│   ├── package.json           # npm依存パッケージ
│   ├── vite.config.js         # Vite設定
│   ├── tailwind.config.js     # TailwindCSS設定
│   ├── postcss.config.js      # PostCSS設定
│   ├── vercel.json            # Vercelデプロイ設定
│   ├── index.html             # HTMLエントリーポイント
│   └── README.md              # フロントエンドドキュメント
│
├── scripts/                    # 便利なスクリプト
│   ├── setup.sh               # 初期セットアップスクリプト
│   ├── deploy-backend.sh      # バックエンドデプロイスクリプト
│   └── deploy-frontend.sh     # フロントエンドデプロイスクリプト
│
├── README.md                   # プロジェクト総合ドキュメント
├── QUICKSTART.md              # クイックスタートガイド
├── DEPLOYMENT.md              # Web UIデプロイ手順
├── DEPLOYMENT_CLI.md          # CLIデプロイ手順
├── PROJECT_STRUCTURE.md       # このファイル
└── .gitignore                 # Git除外設定
```

## ファイルの役割

### バックエンド

#### `app/main.py`
- FastAPIアプリケーションのメインファイル
- `/api/compare` エンドポイントの定義
- CORS設定
- 画像ファイルの受信と処理のオーケストレーション

#### `app/similarity.py`
- **全体類似度**: SSIM（構造的類似性インデックス）を計算
- **色合い類似度**: HSV色空間でのヒストグラム比較
- **構図類似度**: Cannyエッジ検出 + SSIM
- 画像のリサイズと正規化

#### `app/heatmap.py`
- 差分マップをカラーヒートマップに変換
- 画像のオーバーレイ処理
- 3画面比較ビューの生成
- 画像をBase64エンコード

#### `app/feature_matching.py`
- ORB検出器による特徴点抽出
- 特徴点のマッチング（BFMatcher）
- マッチング結果の可視化
- マッチングスコアの計算

### フロントエンド

#### `src/App.jsx`
- アプリケーション全体の状態管理
- 画像選択、比較処理、結果表示の制御
- エラーハンドリング

#### `src/api.js`
- Axiosを使用したバックエンドAPI通信
- 環境変数からAPIのベースURL取得
- エラーハンドリングとタイムアウト設定

#### `src/components/ImageUploader.jsx`
- ドラッグ&ドロップ対応の画像アップローダー
- 画像プレビュー表示
- ファイル形式とサイズのバリデーション

#### `src/components/SimilarityScores.jsx`
- 3つの類似度スコアを円形プログレスバーで表示
- スコアに応じた色分け（緑/黄/オレンジ/赤）
- 総合評価コメントの生成

#### `src/components/HeatmapViewer.jsx`
- ヒートマップと特徴点マッチングのタブ切り替え
- 3つのビューモード（比較/ヒートマップ/オーバーレイ）
- 凡例の表示

#### `src/components/ResultDisplay.jsx`
- 類似度スコアとヒートマップの統合表示
- 結果のテキスト保存機能

#### `src/components/LoadingSpinner.jsx`
- 処理中の視覚的フィードバック
- プログレスバーとスピナーアニメーション

### スクリプト

#### `scripts/setup.sh`
- バックエンドとフロントエンドの一括セットアップ
- 仮想環境の作成
- 依存パッケージのインストール
- 環境変数ファイルの作成

#### `scripts/deploy-backend.sh`
- Render CLIを使用したバックエンドデプロイ
- CLIインストール確認
- ログイン状態確認

#### `scripts/deploy-frontend.sh`
- Vercel CLIを使用したフロントエンドデプロイ
- プレビュー/本番環境の選択
- 環境変数の確認と設定

## データフロー

```
1. ユーザーが2枚の画像をアップロード
   ↓
2. フロントエンド（api.js）がFormDataでバックエンドに送信
   ↓
3. バックエンド（main.py）が画像を受信
   ↓
4. similarity.pyで3つの類似度を計算
   ├── 全体類似度（SSIM）
   ├── 色合い類似度（HSVヒストグラム）
   └── 構図類似度（エッジSSIM）
   ↓
5. heatmap.pyで差分ヒートマップを生成
   ↓
6. feature_matching.pyで特徴点マッチングを実行
   ↓
7. すべての結果をJSON形式でフロントエンドに返却
   ↓
8. フロントエンド（ResultDisplay.jsx）が結果を表示
   ├── SimilarityScores.jsx: スコア表示
   └── HeatmapViewer.jsx: ヒートマップ/マッチング表示
```

## 技術スタック詳細

### バックエンド
- **FastAPI**: 高速なPython Webフレームワーク
- **OpenCV (opencv-python-headless)**: 画像処理ライブラリ
- **scikit-image**: SSIMなどの画像メトリクス
- **NumPy**: 数値計算ライブラリ
- **Pillow**: 画像の入出力とエンコーディング

### フロントエンド
- **React 18**: UIライブラリ
- **Vite**: 高速なビルドツール
- **TailwindCSS**: ユーティリティファーストCSSフレームワーク
- **Axios**: HTTP通信ライブラリ

### デプロイ
- **Render**: バックエンドホスティング（無料プランあり）
- **Vercel**: フロントエンドホスティング（無料プランあり）

## 環境変数

### バックエンド
現在は特に必要な環境変数はありません（将来の拡張用）

### フロントエンド
- `VITE_API_URL`: バックエンドAPIのURL
  - 開発: `http://localhost:8000`
  - 本番: `https://your-backend.onrender.com`

## API仕様

### POST /api/compare

**リクエスト:**
- Content-Type: `multipart/form-data`
- Body:
  - `image1`: 画像ファイル（JPEG/PNG、最大10MB）
  - `image2`: 画像ファイル（JPEG/PNG、最大10MB）

**レスポンス:**
```json
{
  "success": true,
  "similarity_scores": {
    "overall_similarity": 85.5,
    "color_similarity": 78.2,
    "structure_similarity": 91.3
  },
  "heatmaps": {
    "overall": {
      "heatmap": "data:image/png;base64,...",
      "overlay": "data:image/png;base64,...",
      "comparison": "data:image/png;base64,..."
    },
    "structure": {
      "heatmap": "data:image/png;base64,...",
      "overlay": "data:image/png;base64,...",
      "comparison": "data:image/png;base64,..."
    }
  },
  "feature_matching": {
    "match_count": 142,
    "keypoints1_count": 500,
    "keypoints2_count": 487,
    "match_score": 68.4,
    "match_image": "data:image/png;base64,..."
  }
}
```

## 拡張性

このプロジェクトは以下の機能を追加しやすい構造になっています：

- 追加の類似度指標（例: パーセプチュアルハッシュ）
- 画像の前処理オプション（ノイズ除去、コントラスト調整など）
- 比較履歴の保存
- ユーザー認証
- バッチ処理機能
- 画像のデータベース保存

