#!/usr/bin/env bash
CURRENT_BRANCH_NAME=$(git branch | sed -n -e 's/^\* \(.*\)/\1/p')
heroku create --remote rpx-xui-test-demo --stack heroku-16 rpx-xui-test-demo
heroku config:set USERNAME=pirate --app rpx-xui-test-demo
heroku config:set PASSWORD=bunting --app rpx-xui-test-demo
heroku config:set YARN_PRODUCTION=false --app rpx-xui-test-demo
git push heroku $CURRENT_BRANCH_NAME:develop
