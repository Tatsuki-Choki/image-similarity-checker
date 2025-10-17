#!/bin/bash

# 画像類似度チェッカーのセットアップスクリプト

set -e

echo "========================================="
echo "画像類似度チェッカー セットアップ"
echo "========================================="
echo ""

# カラー出力
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# バックエンドのセットアップ
echo -e "${GREEN}[1/4] バックエンドのセットアップ${NC}"
cd backend

if [ ! -d "venv" ]; then
    echo "仮想環境を作成中..."
    python3 -m venv venv
fi

echo "仮想環境を有効化中..."
source venv/bin/activate

echo "依存パッケージをインストール中..."
pip install -r requirements.txt

echo -e "${GREEN}✓ バックエンドのセットアップ完了${NC}"
echo ""

# フロントエンドのセットアップ
echo -e "${GREEN}[2/4] フロントエンドのセットアップ${NC}"
cd ../frontend

echo "依存パッケージをインストール中..."
npm install

echo -e "${GREEN}✓ フロントエンドのセットアップ完了${NC}"
echo ""

# 環境変数の確認
echo -e "${GREEN}[3/4] 環境変数の確認${NC}"
if [ ! -f ".env" ]; then
    echo ".envファイルを作成中..."
    echo "VITE_API_URL=http://localhost:8000" > .env
    echo -e "${GREEN}✓ .envファイルを作成しました${NC}"
else
    echo -e "${YELLOW}⚠ .envファイルは既に存在します${NC}"
fi
echo ""

# 完了
echo -e "${GREEN}[4/4] セットアップ完了${NC}"
echo ""
echo "========================================="
echo "セットアップが完了しました！"
echo "========================================="
echo ""
echo "次のステップ："
echo ""
echo "1. バックエンドを起動（ターミナル1）："
echo "   cd backend"
echo "   source venv/bin/activate"
echo "   uvicorn app.main:app --reload"
echo ""
echo "2. フロントエンドを起動（ターミナル2）："
echo "   cd frontend"
echo "   npm run dev"
echo ""
echo "3. ブラウザで開く："
echo "   http://localhost:5173"
echo ""

