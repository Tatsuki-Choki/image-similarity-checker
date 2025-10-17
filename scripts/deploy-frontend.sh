#!/bin/bash

# フロントエンドデプロイスクリプト（Vercel CLI）

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo "========================================="
echo "フロントエンドデプロイ (Vercel)"
echo "========================================="
echo ""

# Vercel CLIがインストールされているか確認
if ! command -v vercel &> /dev/null; then
    echo -e "${RED}エラー: Vercel CLIがインストールされていません${NC}"
    echo ""
    echo "以下のコマンドでインストールしてください："
    echo "  npm install -g vercel"
    exit 1
fi

echo -e "${GREEN}✓ Vercel CLIが見つかりました${NC}"
echo ""

# フロントエンドディレクトリに移動
cd frontend

# 環境変数の確認
echo -e "${YELLOW}環境変数を確認しています...${NC}"
if [ ! -f ".env" ]; then
    echo -e "${RED}警告: .envファイルが見つかりません${NC}"
    echo ""
    read -p "バックエンドのURLを入力してください: " BACKEND_URL
    echo "VITE_API_URL=$BACKEND_URL" > .env
    echo -e "${GREEN}✓ .envファイルを作成しました${NC}"
fi

# デプロイタイプを選択
echo ""
echo "デプロイタイプを選択してください："
echo "1) プレビュー（テスト用）"
echo "2) 本番環境"
read -p "選択 [1-2]: " DEPLOY_TYPE

case $DEPLOY_TYPE in
    1)
        echo -e "${GREEN}プレビューデプロイを開始します...${NC}"
        vercel
        ;;
    2)
        echo -e "${GREEN}本番環境へのデプロイを開始します...${NC}"
        vercel --prod
        ;;
    *)
        echo -e "${RED}無効な選択です${NC}"
        exit 1
        ;;
esac

echo ""
echo "========================================="
echo -e "${GREEN}デプロイが完了しました！${NC}"
echo "========================================="
echo ""
echo "発行されたURLをブラウザで開いて動作確認してください。"
echo ""

