# 画像類似度チェッカー

YouTubeサムネイル画像のトレース判定を行うWebアプリケーションです。2枚の画像を比較し、全体類似度、色合い類似度、構図類似度の3つの指標で評価します。

## 機能

- **全体類似度**: SSIM（構造的類似性インデックス）による評価
- **色合い類似度**: HSV色空間でのヒストグラム比較
- **構図類似度**: Cannyエッジ検出による構造比較
- **差分ヒートマップ**: 画像間の違いを色で可視化
- **特徴点マッチング**: ORB検出器による対応点の検出と可視化

## 技術スタック

### バックエンド
- Python 3.11
- FastAPI
- OpenCV
- scikit-image
- NumPy

### フロントエンド
- React 18
- Vite
- TailwindCSS
- Axios

## セットアップ

### バックエンド

```bash
cd backend

# 仮想環境の作成
python -m venv venv

# 仮想環境の有効化
# macOS/Linux:
source venv/bin/activate
# Windows:
# venv\Scripts\activate

# 依存パッケージのインストール
pip install -r requirements.txt

# サーバーの起動
uvicorn app.main:app --reload
```

バックエンドは http://localhost:8000 で起動します。

### フロントエンド

```bash
cd frontend

# 依存パッケージのインストール
npm install

# 環境変数の設定
cp .env.example .env
# .envファイルを編集してバックエンドのURLを設定

# 開発サーバーの起動
npm run dev
```

フロントエンドは http://localhost:5173 で起動します。

## デプロイ

### CLI経由でのデプロイ（推奨）

#### 必要なCLIツールのインストール

```bash
# Render CLI
brew tap render-oss/render
brew install render

# Vercel CLI
npm install -g vercel
```

#### バックエンドのデプロイ（Render）

```bash
# ログイン
render login

# デプロイスクリプトを実行
./scripts/deploy-backend.sh

# または手動で
cd backend
render deploy
```

#### フロントエンドのデプロイ（Vercel）

```bash
# ログイン
vercel login

# デプロイスクリプトを実行
./scripts/deploy-frontend.sh

# または手動で
cd frontend
vercel --prod
```

詳細な手順は [DEPLOYMENT_CLI.md](DEPLOYMENT_CLI.md) を参照してください。

### Web UI経由でのデプロイ

Web UIを使用したデプロイ方法は [DEPLOYMENT.md](DEPLOYMENT.md) を参照してください。

## 使い方

1. 比較したい2枚の画像（JPEG、PNG形式）をアップロード
2. 「類似度をチェック」ボタンをクリック
3. 結果を確認：
   - 3つの類似度スコア（0-100%）
   - 差分ヒートマップ（赤=差が大きい、青=差が小さい）
   - 特徴点マッチング画像

## API仕様

### POST /api/compare

2枚の画像を比較し、類似度を計算します。

**リクエスト**
- Content-Type: `multipart/form-data`
- Body:
  - `image1`: 画像ファイル（JPEG/PNG）
  - `image2`: 画像ファイル（JPEG/PNG）

**レスポンス**
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

## プロジェクト構成

```
/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py              # FastAPIアプリケーション
│   │   ├── similarity.py        # 類似度計算
│   │   ├── heatmap.py          # ヒートマップ生成
│   │   └── feature_matching.py # 特徴点マッチング
│   ├── requirements.txt
│   ├── Dockerfile
│   └── render.yaml
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ImageUploader.jsx
│   │   │   ├── SimilarityScores.jsx
│   │   │   ├── HeatmapViewer.jsx
│   │   │   ├── ResultDisplay.jsx
│   │   │   └── LoadingSpinner.jsx
│   │   ├── App.jsx
│   │   ├── api.js
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   ├── vite.config.js
│   └── vercel.json
└── README.md
```

## ライセンス

MIT

