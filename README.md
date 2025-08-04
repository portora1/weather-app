天気アプリ(React + TypeScript + Vite)
React,TypeScript,Viteを使用して作成した天気アプリです。
指定した地域、都市の現在の天気をリアルタイム表示させる機能をメインに、お気に入り登録、ダッシュボード、検索サジェスト機能を取り入れてみました。

主な機能
・リアルタイム天気情報：　 OoenWeatherMap APIを利用して世界の都市の現在の天気と気温を表示させる。
・日本語対応ジオコーディング：　「東京」のように日本語名で都市の検索ができる。
・お気に入りダッシュボード：　地域のお気に入り登録機能と、いくつかの地域を同時に見たいのでダッシュボード可させました。
・検索サジェスト機能：地域名の入力中に、GeoDBCitiesAPIを利用して候補を動的に表示できるようにしてみたが、アルファベットで検索欄に入力したときはある程度機能するが、「東京」のような打ち方をした時には何も機能していない、残念。
・堅牢なエラーハンドリング：存在しない地域が入力された時にエラーメッセージを表示するようにしました。

セットアップと実行方法
このAPPを動かすにはいくつくかの APIキーの設定が必要です。
1. プロジェクトのクローンと依存関係のインストール
```bash
git clone https://github/com/portora1/weather-app.git
cd weather-app
yarn install
or
npm install
```
2. APIキーの準備
以下の二つのAPIサービスから、無料でAPIキーを取得してください。
。[OpenWeatherMap公式サイト](https://www.google.com/url?sa=E&q=https%3A%2F%2Fopenweathermap.org%2F)　(天気情報・ジオコーディング)
・[RapidAPI GeoDB Cities APIページ](https://www.google.com/url?sa=E&q=https%3A%2F%2Frapidapi.com%2Fwirefreethought%2Fapi%2Fgeodb-cities) (検索サジェスト)

3. 環境変数の設定
プロジェクトのルートディレクトリに.env.localというファイルを作成し、以下の内容を記述してください。　...の部分はご自身のAPIキーを設定ください。

```bash
VITE_OPENWEATHER_API_KEY=...ここにOpenWeatherMapのAPIキー...
VITE_GEODB_API_KEY=...ここにRapidAPIのGeoDB APIキー...
```
この.env.localファイルはGitの管理対象から除外されてるので、キーをGitHubにアップロードしないでください。

4. 開発サーバー起動
```bash
yarn dev
or
npm run dev
```
ブラウザでhttp://localhost:5173 にアクセスしてください。
使用技術
React
TypeScript
Vite
OpenWeatherMap API
GeoDB Cities API
Custom Hooks (useDebounce)