# デプロイマニュアル

## バックエンドのデプロイ（Render）

### 手順

1. **Renderアカウントの作成**
   - https://render.com にアクセス
   - GitHubアカウントで登録

2. **新しいWeb Serviceを作成**
   - ダッシュボードから「New +」→「Web Service」を選択
   - GitHubリポジトリを接続

3. **設定**
   ```
   Name: image-similarity-api
   Region: Singapore（日本に近いリージョン）
   Branch: main
   Root Directory: backend
   Runtime: Python 3
   Build Command: pip install -r requirements.txt
   Start Command: uvicorn app.main:app --host 0.0.0.0 --port $PORT
   ```

4. **プランの選択**
   - Free プランを選択（無料）
   - スリープ機能があるため、初回アクセス時は起動に時間がかかります

5. **環境変数の設定（オプション）**
   ```
   PYTHON_VERSION=3.11.0
   ```

6. **デプロイ**
   - 「Create Web Service」をクリック
   - デプロイが完了するまで待機（5-10分程度）
   - デプロイ完了後、URLをコピー（例: https://image-similarity-api.onrender.com）

### 確認

デプロイ完了後、以下のURLでヘルスチェック：
```
https://your-app-name.onrender.com/health
```

正常な場合、以下のレスポンスが返ります：
```json
{"status": "healthy"}
```

---

## フロントエンドのデプロイ（Vercel）

### 手順

1. **Vercelアカウントの作成**
   - https://vercel.com にアクセス
   - GitHubアカウントで登録

2. **新しいプロジェクトを作成**
   - ダッシュボードから「New Project」を選択
   - GitHubリポジトリをインポート

3. **設定**
   ```
   Framework Preset: Vite
   Root Directory: frontend
   Build Command: npm run build
   Output Directory: dist
   Install Command: npm install
   ```

4. **環境変数の設定**
   - 「Environment Variables」セクションで以下を追加：
   ```
   Key: VITE_API_URL
   Value: https://your-backend-app.onrender.com
   ```
   - 上記のValueはRenderでデプロイしたバックエンドのURLに置き換えてください

5. **デプロイ**
   - 「Deploy」をクリック
   - ビルドが完了するまで待機（2-5分程度）
   - デプロイ完了後、URLが発行されます

### CORS設定の更新

フロントエンドのデプロイが完了したら、バックエンドのCORS設定を更新します：

1. `backend/app/main.py` を編集
2. `allow_origins` にVercelのURLを追加：
   ```python
   allow_origins=[
       "http://localhost:3000",
       "http://localhost:5173",
       "https://your-frontend.vercel.app",  # ← Vercelから発行されたURL
       "https://*.vercel.app",
   ],
   ```
3. 変更をGitHubにプッシュ
4. Renderが自動的に再デプロイ

---

## 動作確認

1. VercelのURLにアクセス
2. 2枚のテスト画像をアップロード
3. 「類似度をチェック」をクリック
4. 10-15秒後に結果が表示されることを確認

### トラブルシューティング

#### バックエンドへの接続エラー
- Renderのサービスが起動しているか確認
- 無料プランの場合、スリープから起動するまで時間がかかる（初回アクセス時は30秒程度待つ）
- ブラウザの開発者ツールでネットワークエラーを確認

#### CORS エラー
- バックエンドの `main.py` で正しいフロントエンドURLが許可されているか確認
- ブラウザのキャッシュをクリア

#### タイムアウトエラー
- 画像サイズが大きすぎる場合は、リサイズして再試行
- Renderの無料プランは性能に制限があるため、処理に時間がかかる場合がある

---

## ローカル開発環境

本番環境と同じ構成でローカルで動作確認する場合：

### バックエンド
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### フロントエンド
```bash
cd frontend
npm install
npm run dev
```

ブラウザで http://localhost:5173 を開く

---

## 更新方法

コードを更新してGitHubにプッシュすると、RenderとVercelが自動的に再デプロイします。

```bash
git add .
git commit -m "Update application"
git push origin main
```

数分後に本番環境に反映されます。

