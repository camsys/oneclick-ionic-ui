
# common build commands for non-local deployments (AWS deployments)

# copy basic assets (background image, icon, counties, localization) into expected folders
cp ./assets/$iconimagename $src_deploy_dir/../src/assets/img/main-logo.png
cp ./assets/$backgroundimagename $src_deploy_dir/../src/assets/img/home-background-image.png

cp ./assets/img/* $src_deploy_dir/../src/assets/img/
cp ./assets/doc/* $src_deploy_dir/../src/assets/doc/
rm $src_deploy_dir/../src/assets/i18n/*
cp ./assets/i18n/* $src_deploy_dir/../src/assets/i18n/

cp ./assets/$client-counties.geojson $src_deploy_dir/../src/assets/data/counties.geojson

# copy appConfig for the client into the expected folders
cp ./appConfig-$client.ts $src_deploy_dir/../src/environments/appConfig.ts

#configure the environment file Ionic will expect based on the prod build flag
if [ $prodflag="--prod" ]
then
cp ./environments/environment-$client.$environment.ts $src_deploy_dir/../src/environments/environment.prod.ts
else
cp ./environments/environment-$client.$environment.ts $src_deploy_dir/../src/environments/environment.ts
fi

# copy version file
cp $src_deploy_dir/version.ts $src_deploy_dir/../src/environments/version.ts

# copy client styles into expected location
cp ./variables-$client.scss $src_deploy_dir/../src/theme/variables.scss

# build code (with or without --prod flag) and upload to aws
cd $src_deploy_dir/..
ionic build $prodflag
aws s3 cp --recursive $src_deploy_dir/../www/ $s3bucket --acl public-read --cache-control no-cache --profile $awsprofile

