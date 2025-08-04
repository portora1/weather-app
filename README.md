# 天気アプリ (React + TypeScript + Vite)

これは、React, TypeScript, Viteを使用して作成されたモダンな天気アプリです。
指定した都市の現在の天気をリアルタイムで表示するほか、お気に入り登録や検索サジェストなどの機能を備えています。

## ✨ 主な機能

*   **リアルタイム天気情報**: OpenWeatherMap APIを利用して、世界の都市の現在の天気と気温を表示します。
*   **日本語対応ジオコーディング**: 「東京」のような日本語名で都市を検索できます。
*   **お気に入りダッシュボード**: よくチェックする都市をお気に入りに登録し、一覧で天気を比較できます。お気に入り情報はブラウザを閉じても保持されます。
*   **検索サジェスト**: 都市名の入力中に、GeoDB Cities APIを利用して候補を動的に表示し、入力を補助します。
*   **堅牢なエラーハンドリング**: 存在しない都市が入力された場合や、API通信に失敗した場合に、ユーザーに分かりやすいメッセージを表示します。

## 🛠️ セットアップと実行方法

このアプリケーションをあなたのローカル環境で動かすには、いくつかのAPIキーの設定が必要です。

### 1. プロジェクトのクローンと依存関係のインストール

まず、このリポジトリをクローンし、プロジェクトフォルダに移動してから、必要なパッケージをインストールします。

```bash
git clone https://github.com/portora1/weather-app.git
cd weather-app
yarn install
# または npm install
Use code with caution.
Markdown
2. APIキーの準備
このアプリケーションは、2つの外部APIサービスを利用しています。以下のリンクからそれぞれ無料で利用登録し、APIキーを取得してください。
OpenWeatherMap API
用途: 天気情報と、日本語都市名の緯度経度への変換（ジオコーディング）
取得場所: OpenWeatherMap公式サイト
手順: サイトでサインアップ後、ログインした状態でアカウントページ内にある「My API keys」メニューから取得できます。
GeoDB Cities API
用途: 都市名入力中の検索候補表示（サジェスト機能）
取得場所: RapidAPI GeoDB Cities APIページ
手順: RapidAPIにサインアップ（GitHubやGoogleアカウントでOK）し、ページ上の「Pricing」タブから無料の「Basic」プランにサブスクライブ（Subscribe）してください。その後、「Endpoints」タブに戻ると、X-RapidAPI-Keyとしてキーが表示されます。
3. 環境変数の設定
取得した2つのAPIキーを、プロジェクトに設定します。
1. .env.local ファイルの作成
プロジェクトのルートディレクトリ（package.jsonファイルと同じ階層）に、.env.localという名前のファイルを新しく作成してください。
2. APIキーの記述
作成した.env.localファイルに、以下の内容をコピー＆ペーストし、...の部分を、あなたが取得した実際のAPIキーに置き換えてください。
Generated .env.local
VITE_OPENWEATHER_API_KEY=...ここにOpenWeatherMapのAPIキー...
VITE_GEODB_API_KEY=...ここにRapidAPIのGeoDB APIキー...
Use code with caution.
.env.local
⚠️注意: この.env.localファイルは、セキュリティのためにGitのバージョン管理から意図的に除外されています。APIキーなどの秘密の情報をGitHubに絶対にアップロードしないでください。
4. 開発サーバーの起動
すべての設定が完了したら、以下のコマンドで開発サーバーを起動します。
Generated bash
yarn dev
# または npm run dev
Use code with caution.
Bash
ブラウザで http://localhost:5173 （ポート番号は異なる場合があります）にアクセスすると、アプリケーションが表示されます。
🚀 使用技術
React: UI構築のためのライブラリ
TypeScript: 静的型付けによる開発効率と安全性の向上
Vite: 高速なフロントエンド開発環境
OpenWeatherMap API: 天気情報・ジオコーディング
GeoDB Cities API: 検索サジェスト
Custom Hooks: useDebounceによるロジックの再利用

