#!/bin/bash

# バックアップファイルを残しておく日数
PERIOD='+30'
# 日付
DATE=`date '+%Y%m%d-%H%M%S'`
# バックアップ先ディレクトリ
SAVEPATH='/home/backup/'
# 先頭文字
PREFIX='postgres-'
# 末尾文字
SUFFIX='-all'
# 拡張子 (PLAINTEXT)
EXT='.sql'
# 拡張子 (ZIP ARCHIVE)
ZIP='.zip'

# データベースバックアップ実行
 pg_dump --dbname='postgresql://<DBユーザー名>:<DBパスワード>@<DBホスト名>/<DB名>?sslmode=require&options=endpoint%3D<エンドポイントID>'  --file=$SAVEPATH$PREFIX$DATE$EXT
# zip
zip $SAVEPATH$PREFIX$DATE$ZIP $SAVEPATH$PREFIX$DATE$EXT
# 元バックアップ削除
sudo rm -f $SAVEPATH$PREFIX$DATE$EXT

# 一定期間を過ぎた過去ファイルを削除
sudo find $SAVEPATH -type f -daystart -mtime $PERIOD -exec rm {} \;
