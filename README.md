# 卓フェス2026 ～サマーシーズン～ 特設サイト

TRPGオンライン交流イベント「卓フェス2026 ～サマーシーズン～」の特設サイト（静的サイト）です。

## 構成ファイル

- [index.html](index.html) - 特設サイトの構造（HTML）
- [style.css](style.css) - 夏や海、夏祭りをイメージしたデザイン、レスポンシブ・アクセシビリティ対応（CSS）
- [script.js](script.js) - 音声選択、入場演出タイムライン、Discord参加ボタンとチェックボックスの連動（JavaScript）
- [assets/](assets/) - アセット保存用ディレクトリ

## 準備が必要なアセット

BGM音声および波の背景動画を配置することで、さらにサイトをリッチにできます。

1. **環境音・BGM音声**
   - 音声ファイルを `assets/summer.mp3` として配置してください。
   - 配置すると、入場時の「音声ありで入場」を選択した際、およびサイト閲覧中（ミュート解除時）にループ再生されます。

2. **背景動画（オプション）**
   - もし背景に海の動画などを流したい場合は、動画ファイルを `assets/wave.mp4` などとして配置します。
   - [index.html](index.html) の `<!-- 動画背景/CSS波背景の切り替え可能エリア -->` の部分に `<video src="assets/wave.mp4" autoplay loop muted playsinline class="video-bg"></video>` を追加してください。

## ローカルでのプレビュー方法

音声再生や演出の挙動（特に一部ブラウザにおけるセキュリティ制限の回避など）を正確に確認するためには、ファイルを直接ブラウザでダブルクリックして開くのではなく、ローカルのWebサーバーを介して閲覧することを推奨します。

### 推奨方法: VS Code の Live Server 拡張機能を使用する
1. VS Codeの拡張機能マーケットプレイスから **Live Server**（Ritwick Dey製）をインストールします。
2. 画面右下の「**Go Live**」ボタンを押すか、[index.html](index.html) を右クリックして「**Open with Live Server**」を選択します。
3. 自動的にブラウザが立ち上がり、特設サイトがプレビューされます。

## Discord招待リンクの変更方法

Discordサーバーへの参加リンクは、[script.js](script.js) の最上部にある `CONFIG.discordLink` 変数を書き換えるだけで、HTML側のボタンリンクも含め一括して変更されます。

```javascript
const CONFIG = {
    // ここを実際のDiscord招待リンクに書き換えてください
    discordLink: "https://discord.gg/実際のコード",
    ...
};
```
