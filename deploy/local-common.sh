# local deployment script

# copy assets for client into expected directories
cp ./assets/$iconimagename ../../src/assets/img/main-logo.png
cp ./assets/$backgroundimagename ../../src/assets/img/home-background-image.png

cp ./assets/img/* ../../src/assets/img/
cp ./assets/doc/* ../../src/assets/doc/

rm ../../src/assets/i18n/*
cp ./assets/i18n/* ../../src/assets/i18n/

cp ./assets/$client-counties.geojson ../../src/assets/data/counties.geojson

# create environment file in expected location
cp ./appConfig-$client.ts ../../src/environments/appConfig.ts
cp ./environments/environment-$client.$environment.ts ../../src/environments/environment.ts

# copy version file
cp ../version.ts ../../src/environments/version.ts

# copy client styles
cp ./variables-$client.scss ../../src/theme/variables.scss

# run locally
ionic serve

