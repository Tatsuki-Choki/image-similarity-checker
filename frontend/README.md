# フロントエンド

React + Viteを使用した画像類似度チェッカーのUIアプリケーション

## セットアップ

### 依存パッケージのインストール

```bash
npm install
```

### 環境変数の設定

`.env` ファイルを作成し、バックエンドAPIのURLを設定：

```
VITE_API_URL=http://localhost:8000
```

本番環境では、RenderにデプロイしたバックエンドのURLに変更してください。

## 開発サーバーの起動

```bash
npm run dev
```

アプリケーションは http://localhost:5173 で起動します。

## ビルド

```bash
npm run build
```

ビルド成果物は `dist/` ディレクトリに出力されます。

## プレビュー

ビルドした成果物をローカルで確認：

```bash
npm run preview
```

## デプロイ

Vercelへのデプロイ手順は `/DEPLOYMENT.md` を参照してください。

## コンポーネント構成

- `App.jsx`: メインアプリケーション
- `components/ImageUploader.jsx`: 画像アップロード
- `components/SimilarityScores.jsx`: 類似度スコア表示
- `components/HeatmapViewer.jsx`: ヒートマップビューアー
- `components/ResultDisplay.jsx`: 結果表示
- `components/LoadingSpinner.jsx`: ローディング表示
- `api.js`: バックエンドAPI通信

## スタイリング

TailwindCSSを使用しています。カスタマイズは `tailwind.config.js` で行ってください。

