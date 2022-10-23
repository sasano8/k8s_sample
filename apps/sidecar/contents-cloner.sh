#!/bin/bash
# 最新WebコンテンツをGitHubからコンテナに取り込む

# コンテンツ元の環境変数がなければエラー
if [ -z $CONTENTS_SOURCE_URL ]; then
    exit 1
fi

git clone $CONTENTS_SOURCE_URL /data

cd /data
while true
do
    date
    sleep 60
    git pull
done
