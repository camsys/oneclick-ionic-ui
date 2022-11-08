#!/usr/bin/env bash

cp ./src/environments/environment.ts ./src/environments/environment.ts.bak
cp ./src/environments/environment.prod.ts ./src/app/environment.ts
ionic build --prod
aws s3 sync ./www/ s3://www.211ride.org --acl public-read  --region us-east-2 --profile ieuw
mv ./src/environments/environment.ts.bak ./src/environments/environment.ts
