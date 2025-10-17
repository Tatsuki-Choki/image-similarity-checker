# CLIでのデプロイ手順

## 前提条件

- Git リポジトリが初期化されていること
- GitHubにコードがプッシュされていること

## バックエンドのデプロイ（Render CLI）

### 1. Render CLIのインストール

```bash
# Homebrewでインストール（macOS）
brew tap render-oss/render
brew install render

# または、npm経由でインストール
npm install -g @renderinc/cli
```

### 2. Renderにログイン

```bash
render login
```

ブラウザが開き、認証が求められます。

### 3. render.yamlの確認

`backend/render.yaml` が既に作成されています。内容を確認：

```yaml
services:
  - type: web
    name: image-similarity-api
    env: python
    buildCommand: pip install -r requirements.txt
    startCommand: uvicorn app.main:app --host 0.0.0.0 --port $PORT
    envVars:
      - key: PYTHON_VERSION
        value: 3.11.0
```

### 4. デプロイの実行

```bash
# プロジェクトルートで実行
cd backend

# Renderにデプロイ
render deploy
```

初回デプロイ時は、サービスの作成を確認されます。

### 5. デプロイ状況の確認

```bash
# サービス一覧を確認
render services list

# ログを確認
render logs
```

### 6. デプロイ完了後

デプロイが完了すると、URLが表示されます：
```
https://image-similarity-api-XXXXX.onrender.com
```

このURLをコピーして、フロントエンドの環境変数に設定します。

---

## フロントエンドのデプロイ（Vercel CLI）

### 1. Vercel CLIのインストール

```bash
npm install -g vercel
```

### 2. Vercelにログイン

```bash
vercel login
```

メールアドレスを入力し、送られてくる確認メールのリンクをクリックします。

### 3. 環境変数の設定

フロントエンドディレクトリに移動し、環境変数を設定：

```bash
cd frontend

# 本番環境の環境変数を設定（RenderのURLに置き換え）
vercel env add VITE_API_URL production
# プロンプトで以下を入力：
# > https://image-similarity-api-XXXXX.onrender.com

# プレビュー環境の環境変数も設定（オプション）
vercel env add VITE_API_URL preview
# > https://image-similarity-api-XXXXX.onrender.com
```

### 4. 最初のデプロイ（セットアップ）

```bash
# フロントエンドディレクトリで実行
cd frontend

# 初回デプロイ（設定を対話的に行う）
vercel
```

プロンプトで以下を入力：

```
? Set up and deploy "~/Documents/Workspace/サムネ採点/frontend"? [Y/n] Y
? Which scope do you want to deploy to? [あなたのアカウント]
? Link to existing project? [N/y] N
? What's your project's name? image-similarity-checker
? In which directory is your code located? ./
? Want to modify these settings? [N/y] N
```

### 5. 本番環境へのデプロイ

```bash
# 本番環境にデプロイ
vercel --prod
```

デプロイが完了すると、本番URLが表示されます：
```
https://image-similarity-checker.vercel.app
```

### 6. デプロイ状況の確認

```bash
# デプロイ一覧を確認
vercel ls

# プロジェクト情報を確認
vercel inspect
```

---

## バックエンドのCORS設定更新

フロントエンドのデプロイが完了したら、バックエンドのCORS設定を更新します：

### 1. main.pyを編集

```bash
cd backend
```

`app/main.py` の `allow_origins` にVercelのURLを追加：

```python
allow_origins=[
    "http://localhost:3000",
    "http://localhost:5173",
    "https://image-similarity-checker.vercel.app",  # ← 追加
    "https://*.vercel.app",
],
```

### 2. 変更をコミットしてプッシュ

```bash
git add .
git commit -m "Update CORS settings for production"
git push origin main
```

### 3. Renderに再デプロイ

```bash
cd backend
render deploy
```

---

## 継続的デプロイ

一度セットアップすれば、以降は簡単にデプロイできます：

### バックエンドの更新

```bash
cd backend
render deploy
```

### フロントエンドの更新

```bash
cd frontend
vercel --prod
```

---

## 便利なコマンド

### Render CLI

```bash
# サービス一覧
render services list

# ログをリアルタイムで表示
render logs --tail

# サービスの詳細情報
render services get <service-id>

# デプロイ履歴
render deploys list
```

### Vercel CLI

```bash
# プロジェクト一覧
vercel ls

# ログを確認
vercel logs

# プロジェクトの削除
vercel remove <project-name>

# ドメインの管理
vercel domains ls

# 環境変数の確認
vercel env ls
```

---

## トラブルシューティング

### Render CLI: "Not authenticated"

```bash
# 再ログイン
render logout
render login
```

### Vercel CLI: "No token found"

```bash
# 再ログイン
vercel logout
vercel login
```

### デプロイが失敗する

```bash
# Render: ログを確認
render logs

# Vercel: ビルドログを確認
vercel logs
```

### 環境変数が反映されない

```bash
# Vercel: 環境変数を再設定
vercel env rm VITE_API_URL production
vercel env add VITE_API_URL production

# 再デプロイ
vercel --prod --force
```

---

## ローカルでビルドテスト

デプロイ前にローカルでビルドテストを実行：

### バックエンド

```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

### フロントエンド

```bash
cd frontend
npm run build
npm run preview
```

エラーがないことを確認してからデプロイしましょう。

