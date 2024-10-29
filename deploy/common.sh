
# common build commands for non-local deployments (AWS deployments)

# copy basic assets (background image, icon, counties, localization) into expected folders
cp ./assets/$iconimagename ../../src/assets/img/main-logo.png
cp ./assets/$backgroundimagename ../../src/assets/img/home-background-image.png

cp ./assets/img/* ../../src/assets/img/
cp ./assets/doc/* ../../src/assets/doc/
rm ../../src/assets/i18n/*
cp ./assets/i18n/* ../../src/assets/i18n/

cp ./assets/$client-counties.geojson ../../src/assets/data/counties.geojson

# copy appConfig for the client into the expected folders
cp ./appConfig-$client.ts ../../src/environments/appConfig.ts

#configure the environment file Ionic will expect based on the prod build flag
if [ $prodflag="--prod" ]
then
cp ./environments/environment-$client.$environment.ts ../../src/environments/environment.prod.ts
else
cp ./environments/environment-$client.$environment.ts ../../src/environments/environment.ts
fi

# copy version file
cp ../version.ts ../../src/environments/version.ts

# copy client styles into expected location
cp ./variables-$client.scss ../../src/theme/variables.scss

# build code (with or without --prod flag) and upload to aws
ionic build $prodflag
aws s3 cp --recursive ../../www/ $s3bucket --acl public-read --cache-control no-cache --profile $awsprofile

