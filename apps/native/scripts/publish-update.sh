#!/bin/bash

environment=$1
development_client=$(jq -r ".build.${environment}.developmentClient" eas.json)


if [ "$development_client" = "true" ]; then
  echo "$environment 대상으로는 업데이트를 할 수 없습니다."
  exit 1
fi

app_version=$(jq -r ".expo.version" app.json) 

supabase_env=$(jq -r ".build.${environment}.env.SUPABASE_ENV" eas.json)

echo "$environment 프로필 대상으로 $supabase_env 환경으로 eas update를 시작합니다. app version $app_version"
SUPABASE_ENV=$supabase_env eas update --auto --channel=$environment

echo "$environment 대상으로 sentry sourcemaps 업로드를 시작합니다."
SENTRY_RELEASE=$app_version npx sentry-expo-upload-sourcemaps dist