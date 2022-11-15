
cp ../../src/assets/img/main-logo.png ../../src/assets/img/main-logo.png.bak
cp ./assets/$iconimagename ../../src/assets/img/main-logo.png
cp ../../src/assets/img/home-background-image.png ../../src/assets/img/home-background-image.png.bak
cp ./assets/$backgroundimagename ../../src/assets/img/home-background-image.png


cp ../../src/environments/appConfig.ts ../../src/environments/appConfig.ts.bak
cp ./appConfig-$client.ts ../../src/environments/appConfig.ts
cp ../../src/environments/environment.ts ../../src/environments/environment.ts.bak
cp ./environments/environment-$client.$environment.ts ../../src/app/environment.ts
cp ../../src/theme/variables.scss ../../src/theme/variables.scss.bak
cp ./variables-$client.scss ../../src/theme/variables.scss

ionic build $prodflag
aws s3 sync ../../www/ $s3bucket --acl public-read --profile $awsprofile

mv ../../src/environments/appConfig.ts.bak ../../src/environments/appConfig.ts
mv ../../src/environments/environment.ts.bak ../../src/environments/environment.ts
mv ../../src/theme/variables.scss.bak ../../src/theme/variables.scss
mv ../../src/assets/img/main-logo.png.bak ../../src/assets/img/main-logo.png
mv ../../src/assets/img/home-background-image.png.bak ../../src/assets/img/home-background-image.png

