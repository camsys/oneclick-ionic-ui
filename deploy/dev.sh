#!/usr/bin/env bash

cp ./src/environments/environment.ts ./src/environments/environment.ts.bak
cp ./src/environments/environment.dev.ts ./src/environments/environment.ts
ionic build
aws s3 sync ./www/ s3://ui-lynx-dev --acl public-read  --region us-east-2 --profile lynx
mv ./src/environments/environment.ts.bak ./src/environments/environment.ts
