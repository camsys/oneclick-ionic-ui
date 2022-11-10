

cp ../src/environments/appConfig.ts ../src/environments/appConfig.ts.bak
cp ../src/environments/appConfig-$client.ts ../src/environments/appConfig.ts
cp ../src/environments/environment.ts ../src/environments/environment.ts.bak
cp ../src/environments/environment.$environment.ts ../src/app/environment.ts
ionic build $prodflag
aws s3 sync ../www/ $s3bucket --acl public-read  --region us-east-2 --profile $awsprofile
mv ../src/environments/appConfig.ts.bak ../src/environments/appConfig.ts
mv ../src/environments/environment.ts.bak ../src/environments/environment.ts