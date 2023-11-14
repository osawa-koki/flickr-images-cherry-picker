#!/bin/bash

project_name=$1
if [ -z "$project_name" ]; then
  echo "project_name is empty"
  exit 1
fi

# 変数をセット
UserPoolId=$(aws cloudformation describe-stacks --stack-name $project_name --query "Stacks[0].Outputs[?OutputKey=='UserPoolId'].OutputValue" --output text --no-cli-pager)
UserPoolClientId=$(aws cloudformation describe-stacks --stack-name $project_name --query "Stacks[0].Outputs[?OutputKey=='UserPoolClientId'].OutputValue" --output text --no-cli-pager)
LambdaFunctionEventApi=$(aws cloudformation describe-stacks --stack-name $project_name --query "Stacks[0].Outputs[?OutputKey=='LambdaFunctionEventApi'].OutputValue" --output text --no-cli-pager)

# .envファイルを作成
echo "" >> .env.local
echo "# Generated automatically by initializer.sh" >> .env.local
echo "# project_name: $project_name" >> .env.local
echo "NEXT_PUBLIC_USER_POOL_ID=$UserPoolId" >> .env.local
echo "NEXT_PUBLIC_USER_POOL_CLIENT_ID=$UserPoolClientId" >> .env.local
echo "NEXT_PUBLIC_API_URL=$LambdaFunctionEventApi" >> .env.local
echo "" >> .env.local
