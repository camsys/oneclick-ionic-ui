
cp ../../src/assets/img/main-logo.png ../../src/assets/img/main-logo.png.bak
cp ./assets/$iconimagename ../../src/assets/img/main-logo.png
cp ../../src/assets/img/home-background-image.png ../../src/assets/img/home-background-image.png.bak
cp ./assets/$backgroundimagename ../../src/assets/img/home-background-image.png


cp ../../src/environments/appConfig.ts ../../src/environments/appConfig.ts.bak
cp ./appConfig-$client.ts ../../src/environments/appConfig.ts

cp ../../src/theme/variables.scss ../../src/theme/variables.scss.bak
cp ./variables-$client.scss ../../src/theme/variables.scss

ionic serve

