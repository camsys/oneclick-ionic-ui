#!/usr/bin/env bash

cp ./src/app/environment.ts ./src/app/environment.ts.bak
cp ./src/environments/environment.prod.ts ./src/app/environment.ts
ionic cordova build browser
aws s3 sync ./www/ s3://www.211ride.org --acl public-read  --region us-east-2 --profile ieuw
mv ./src/app/environment.ts.bak ./src/app/environment.ts
