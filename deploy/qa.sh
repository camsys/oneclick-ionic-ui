#!/usr/bin/env bash

cp ./src/environments/environment.ts ./src/environments/environment.ts.bak
cp ./src/environments/environment.qa.ts ./src/app/environment.ts
ionic build
aws s3 sync ./www/ s3://ui-ieuw-qa --acl public-read  --region us-east-2 --profile ieuw
mv ./src/environments/environment.ts.bak ./src/environments/environment.ts
