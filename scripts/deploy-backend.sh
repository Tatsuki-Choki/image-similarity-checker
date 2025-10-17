#!/bin/bash

# バックエンドデプロイスクリプト（Render CLI）

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo "========================================="
echo "バックエンドデプロイ (Render)"
echo "========================================="
echo ""

# Render CLIがインストールされているか確認
if ! command -v render &> /dev/null; then
    echo -e "${RED}エラー: Render CLIがインストールされていません${NC}"
    echo ""
    echo "以下のコマンドでインストールしてください："
    echo "  brew tap render-oss/render"
    echo "  brew install render"
    echo ""
    echo "または："
    echo "  npm install -g @renderinc/cli"
    exit 1
fi

# ログイン状態を確認
echo -e "${YELLOW}Render CLIにログインしているか確認中...${NC}"
if ! render services list &> /dev/null; then
    echo -e "${RED}エラー: Renderにログインしていません${NC}"
    echo ""
    echo "以下のコマンドでログインしてください："
    echo "  render login"
    exit 1
fi

echo -e "${GREEN}✓ ログイン確認完了${NC}"
echo ""

# バックエンドディレクトリに移動
cd backend

# デプロイ実行
echo -e "${GREEN}デプロイを開始します...${NC}"
render deploy

echo ""
echo "========================================="
echo -e "${GREEN}デプロイが完了しました！${NC}"
echo "========================================="
echo ""
echo "次のステップ："
echo "1. Renderのダッシュボードでサービスの状態を確認"
echo "2. 発行されたURLをコピー"
echo "3. フロントエンドの環境変数に設定"
echo ""

