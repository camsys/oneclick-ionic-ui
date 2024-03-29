
# common build commands for non-local deployments (AWS deployments)

# copy basic assets (background image, icon, counties, localization) into expected folders
cp ../../src/assets/img/main-logo.png ../../src/assets/img/main-logo.png.bak
cp ./assets/$iconimagename ../../src/assets/img/main-logo.png
cp ../../src/assets/img/home-background-image.png ../../src/assets/img/home-background-image.png.bak
cp ./assets/$backgroundimagename ../../src/assets/img/home-background-image.png

cp ./assets/img/* ../../src/assets/img/
cp ./assets/doc/* ../../src/assets/doc/
rm ../../src/assets/i18n/*
cp ./assets/i18n/* ../../src/assets/i18n/

cp ../../src/assets/data/counties.geojson ../../src/assets/data/counties.geojson.bak
cp ./assets/$client-counties.geojson ../../src/assets/data/counties.geojson

# copy appConfig for the client into the expected folders
cp ../../src/environments/appConfig.ts ../../src/environments/appConfig.ts.bak
cp ./appConfig-$client.ts ../../src/environments/appConfig.ts

#configure the environment file Ionic will expect based on the prod build flag
if [ $prodflag="--prod" ]
then
cp ../../src/environments/environment.ts ../../src/environments/environment.prod.ts.bak
cp ./environments/environment-$client.$environment.ts ../../src/environments/environment.prod.ts
else
cp ../../src/environments/environment.ts ../../src/environments/environment.ts.bak
cp ./environments/environment-$client.$environment.ts ../../src/environments/environment.ts
fi

# copy version file
cp ../version.ts ../../src/environments/version.ts

# copy client styles into expected location
cp ../../src/theme/variables.scss ../../src/theme/variables.scss.bak
cp ./variables-$client.scss ../../src/theme/variables.scss

# build code (with or without --prod flag) and upload to aws
ionic build $prodflag
aws s3 sync ../../www/ $s3bucket --acl public-read --cache-control no-cache --profile $awsprofile

mv ../../src/environments/appConfig.ts.bak ../../src/environments/appConfig.ts

if [ $prodflag="--prod" ]
then
mv ../../src/environments/environment.prod.ts.bak ../../src/environments/environment.prod.ts
else
mv ../../src/environments/environment.ts.bak ../../src/environments/environment.ts
fi

mv ../../src/theme/variables.scss.bak ../../src/theme/variables.scss
mv ../../src/assets/img/main-logo.png.bak ../../src/assets/img/main-logo.png
mv ../../src/assets/img/home-background-image.png.bak ../../src/assets/img/home-background-image.png
mv ../../src/assets/data/counties.geojson.bak ../../src/assets/data/counties.geojson.png

