# デプロイURL

## GitHubリポジトリ
https://github.com/Tatsuki-Choki/image-similarity-checker

## フロントエンド（Vercel）
- **URL**: https://frontend-i58taxe7o-tatsuki-chokis-projects.vercel.app
- **Dashboard**: https://vercel.com/tatsuki-chokis-projects/frontend/settings
- **Status**: ✅ デプロイ完了

## バックエンド（Render）
以下の手順でデプロイしてください：

### Renderでのデプロイ手順

1. **Renderダッシュボードを開く**
   https://dashboard.render.com

2. **新しいBlueprintを作成**
   - 「New +」ボタンをクリック
   - 「Blueprint」を選択

3. **GitHubリポジトリを接続**
   - リポジトリ: `Tatsuki-Choki/image-similarity-checker`
   - ブランチ: `main`
   - Blueprint file: `backend/render.yaml`

4. **デプロイ開始**
   - 「Apply」ボタンをクリック
   - デプロイが自動的に開始されます（5-10分程度）

5. **バックエンドURLを取得**
   - デプロイ完了後、URLが表示されます
   - 例: `https://image-similarity-api-XXXXX.onrender.com`

### デプロイ完了後の設定

バックエンドのURLを取得したら、フロントエンドの環境変数を更新：

```bash
cd frontend
vercel env add VITE_API_URL production
# プロンプトでRenderのURLを入力
# 例: https://image-similarity-api-XXXXX.onrender.com

# フロントエンドを再デプロイ
vercel --prod
```

## 動作確認

1. フロントエンドのURLにアクセス
2. 2枚のテスト画像をアップロード
3. 「類似度をチェック」をクリック
4. 結果が表示されることを確認

## 注意事項

- Renderの無料プランでは、しばらくアクセスがないとサービスがスリープします
- 初回アクセス時は起動に30秒〜1分程度かかる場合があります
- スリープから復帰後は通常通り動作します

