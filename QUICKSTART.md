# クイックスタートガイド

このガイドに従えば、5分でローカル環境で動作確認できます。

## 前提条件

- Python 3.11以上
- Node.js 18以上
- npm または yarn

## セットアップスクリプトを使用（推奨）

プロジェクトルートで以下を実行：

```bash
./scripts/setup.sh
```

これで自動的にバックエンドとフロントエンドのセットアップが完了します。

その後、以下の手順で起動してください：

**ターミナル1（バックエンド）:**
```bash
cd backend
source venv/bin/activate
uvicorn app.main:app --reload
```

**ターミナル2（フロントエンド）:**
```bash
cd frontend
npm run dev
```

ブラウザで http://localhost:5173 を開きます。

---

## 手動セットアップ

セットアップスクリプトを使用しない場合は、以下の手順に従ってください：

### 1. バックエンドの起動

```bash
# バックエンドディレクトリに移動
cd backend

# 仮想環境の作成と有効化
python -m venv venv
source venv/bin/activate  # macOS/Linux
# venv\Scripts\activate   # Windows

# 依存パッケージのインストール
pip install -r requirements.txt

# サーバーの起動
uvicorn app.main:app --reload
```

ターミナルに以下のメッセージが表示されれば成功：
```
INFO:     Uvicorn running on http://127.0.0.1:8000
```

このターミナルは開いたままにしてください。

## 2. フロントエンドの起動

**新しいターミナルを開いて**以下を実行：

```bash
# フロントエンドディレクトリに移動
cd frontend

# 依存パッケージのインストール
npm install

# 環境変数ファイルの作成
echo "VITE_API_URL=http://localhost:8000" > .env

# 開発サーバーの起動
npm run dev
```

ターミナルに以下のメッセージが表示されれば成功：
```
  VITE ready in XXX ms
  ➜  Local:   http://localhost:5173/
```

## 3. アプリケーションを開く

ブラウザで以下のURLを開きます：

```
http://localhost:5173
```

## 4. 動作確認

1. 比較したい2枚の画像を用意（JPEG または PNG 形式）
2. 画像1と画像2をそれぞれアップロード
3. 「類似度をチェック」ボタンをクリック
4. 10-15秒後に結果が表示されます

## トラブルシューティング

### エラー: `ModuleNotFoundError: No module named 'cv2'`

OpenCVのインストールに失敗している可能性があります：

```bash
pip install opencv-python-headless
```

### エラー: `Connection refused`

バックエンドが起動していないか、URLが間違っています：

1. バックエンドのターミナルでサーバーが起動しているか確認
2. `frontend/.env` ファイルで `VITE_API_URL=http://localhost:8000` が正しく設定されているか確認

### エラー: `CORS policy`

バックエンドのCORS設定を確認してください。通常は自動的に設定されています。

### ポート 8000 が使用中

別のプロセスがポート8000を使用している場合：

```bash
# 異なるポートで起動
uvicorn app.main:app --reload --port 8001
```

フロントエンドの `.env` ファイルも更新：
```
VITE_API_URL=http://localhost:8001
```

## 次のステップ

- 本番環境へのデプロイ: `DEPLOYMENT.md` を参照
- API仕様の確認: http://localhost:8000/docs
- コードのカスタマイズ: 各ディレクトリの `README.md` を参照

