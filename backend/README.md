# バックエンドAPI

FastAPIを使用した画像類似度チェックAPI

## セットアップ

### 依存パッケージのインストール

```bash
# 仮想環境の作成
python -m venv venv

# 仮想環境の有効化
source venv/bin/activate  # macOS/Linux
# venv\Scripts\activate   # Windows

# パッケージのインストール
pip install -r requirements.txt
```

## 開発サーバーの起動

```bash
uvicorn app.main:app --reload
```

APIは http://localhost:8000 で起動します。

## APIドキュメント

サーバー起動後、以下のURLで自動生成されたAPIドキュメントを確認できます：

- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## エンドポイント

### GET /
ルートエンドポイント（API情報）

### GET /health
ヘルスチェック

### POST /api/compare
画像比較エンドポイント

**リクエスト:**
- Content-Type: multipart/form-data
- Body:
  - image1: 画像ファイル（JPEG/PNG）
  - image2: 画像ファイル（JPEG/PNG）

**レスポンス:**
```json
{
  "success": true,
  "similarity_scores": {
    "overall_similarity": 85.5,
    "color_similarity": 78.2,
    "structure_similarity": 91.3
  },
  "heatmaps": {...},
  "feature_matching": {...}
}
```

## テスト

curlでのテスト例：

```bash
curl -X POST "http://localhost:8000/api/compare" \
  -H "accept: application/json" \
  -H "Content-Type: multipart/form-data" \
  -F "image1=@/path/to/image1.jpg" \
  -F "image2=@/path/to/image2.jpg"
```

## デプロイ

Renderへのデプロイ手順は `/DEPLOYMENT.md` を参照してください。

