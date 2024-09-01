# 概要
dirShareAppのバックエンド

* golangで実装
* `ls`とファイルの保存機能，およびファイル閲覧機能に対応予定

# アクセス
* `ls` : `/api/ls?path=<>`
* `touch`: `/api/touch?path=<>&name={}`
* `mkdir`: `/api/mkdir?path=<>&name={}`
* UploadForm : `/upload?path=<>`
* `view`: `/view?path=<>`
### パラメタ
* Name: fileを指定　
* path: 共有Dirからの相対パス 未指定なら共有Dir直下を対象に処理


# 進捗
* `ls`とFormの処理まで実装
* `/upload`で存在しないDirを入力された時のエラーハンドリングを追加する必要あり
* `view`の実装完了