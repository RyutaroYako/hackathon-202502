# 本屋の在庫管理システム

## 概要

このシステムは、本屋での書籍の在庫を管理するためのウェブアプリケーションです。書籍の入庫、販売、在庫数の管理を効率化し、欠品を防ぎます。

## 主な機能

1. **書籍登録機能**
   - 書籍の基本情報（タイトル、著者、価格、ISBNコード）の登録
   - 在庫数を登録

2. **在庫管理機能**
   - 現在の在庫数をリアルタイムで表示
   - 在庫数が設定された閾値を下回るとアラート通知

3. **販売管理機能**
   - 売上時に在庫数を自動で更新
   - 売上データの記録

4. **アラート機能**
   - 在庫数が低下した場合に通知（閾値設定）

## 技術スタック

- **フロントエンド**: React + TypeScript + TailwindCSS
- **バックエンド**: Express + TypeScript
- **データベース**: PostgreSQL
- **コンテナ化**: Docker Compose

## プロジェクト構成

```
.
├── backend/             # バックエンドコード
│   ├── package.json     # 依存関係
│   ├── tsconfig.json    # TypeScript設定
│   └── src/             # ソースコード
│       └── index.ts     # メインアプリケーション
├── frontend/            # フロントエンドコード
│   ├── package.json     # 依存関係
│   ├── tsconfig.json    # TypeScript設定
│   ├── index.html       # HTMLエントリーポイント
│   └── src/             # ソースコード
│       ├── components/  # Reactコンポーネント
│       ├── App.tsx      # メインアプリケーション
│       ├── api.ts       # APIクライアント
│       └── types.ts     # 型定義
├── db/                  # データベース関連ファイル
│   ├── init/            # 初期化スクリプト
│   │   ├── 01-schema.sql    # スキーマ定義
│   │   └── 02-test-data.sql # テストデータ
│   └── reset-db.sh      # DB初期化スクリプト
├── docker-compose.yml   # Docker Compose設定
└── .gitignore           # Git除外ファイル
```

## 実装詳細

### バックエンド

- Express.jsを使用したRESTful API
- PostgreSQLデータベースで書籍情報と売上データを管理
- 書籍、販売、アラートのエンドポイントを提供
- トランザクション処理による在庫と販売データの整合性確保

### フロントエンド

- Reactを使用したモジュラーコンポーネント
- TailwindCSSによるスタイリング
- バックエンドAPIとの連携

### データベース

- PostgreSQL 15を使用
- 書籍テーブル（books）と販売テーブル（sales）の2つのテーブル
- 外部キー制約による参照整合性の確保
- トリガーによる更新日時の自動更新

## データベーススキーマ

### booksテーブル
- id: UUID (主キー)
- title: VARCHAR(255) (書籍タイトル)
- author: VARCHAR(255) (著者名)
- price: DECIMAL(10, 2) (価格)
- isbn: VARCHAR(20) (ISBNコード、一意制約あり)
- stock: INTEGER (在庫数)
- threshold: INTEGER (アラート閾値)
- created_at: TIMESTAMP WITH TIME ZONE (作成日時)
- updated_at: TIMESTAMP WITH TIME ZONE (更新日時)

### salesテーブル
- id: UUID (主キー)
- book_id: UUID (書籍ID、外部キー)
- quantity: INTEGER (販売数量)
- total_amount: DECIMAL(10, 2) (販売合計金額)
- date: TIMESTAMP WITH TIME ZONE (販売日時)
- created_at: TIMESTAMP WITH TIME ZONE (作成日時)

## 起動方法

以下のコマンドで環境を起動できます：

```bash
docker compose up
```

これにより：
1. PostgreSQLデータベースがポート5432で起動
2. バックエンドサーバーがポート3001で起動
3. フロントエンド開発サーバーがポート3000で起動
4. 必要な依存関係がインストール
5. データベースの初期化とテストデータの投入が自動的に行われる

起動後、以下のURLでアプリケーションにアクセスできます：
- フロントエンド: http://localhost:3000
- バックエンドAPI: http://localhost:3001

## データベースのリセット

開発中にデータベースをリセットしてテストデータを再投入したい場合は、以下のコマンドを実行します：

```bash
./db/reset-db.sh
```

このスクリプトは以下の処理を行います：
1. データベースを削除して再作成
2. スキーマを適用
3. テストデータを投入

## テストデータ

システムには以下の日本の文学作品に関するテストデータが含まれています：

- 雪国 (川端康成)
- 人間失格 (太宰治)
- 坊っちゃん (夏目漱石)
- 舞姫 (森鴎外)
- 羅生門 (芥川龍之介)
- 蟹工船 (小林多喜二)
- 吾輩は猫である (夏目漱石)
- 銀河鉄道の夜 (宮沢賢治)
- 走れメロス (太宰治)