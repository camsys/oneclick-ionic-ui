# local deployment script
# Define NVM_DIR (adjust if NVM is installed elsewhere)
export NVM_DIR="$HOME/.nvm"

# Source nvm.sh to load NVM functions
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# Optional: Source nvm bash_completion if needed
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"

# Now you can use NVM commands
nvm use 16  # Example: Use Node.js version 16

# copy assets for client into expected directories
cp ./assets/$iconimagename $src_deploy_dir/../src/assets/img/main-logo.png
cp ./assets/$backgroundimagename $src_deploy_dir/../src/assets/img/home-background-image.png

cp ./assets/img/* $src_deploy_dir/../src/assets/img/
cp ./assets/doc/* $src_deploy_dir/../src/assets/doc/

rm $src_deploy_dir/../src/assets/i18n/*
cp ./assets/i18n/* $src_deploy_dir/../src/assets/i18n/

cp ./assets/$client-counties.geojson $src_deploy_dir/../src/assets/data/counties.geojson

# create environment file in expected location
cp ./appConfig-$client.ts $src_deploy_dir/../src/environments/appConfig.ts
cp ./environments/environment-$client.$environment.ts $src_deploy_dir/../src/environments/environment.ts

# copy version file
cp $src_deploy_dir/version.ts $src_deploy_dir/../src/environments/version.ts

# copy client styles
cp ./variables-$client.scss $src_deploy_dir/../src/theme/variables.scss

# run locally
cd $src_deploy_dir/..
ionic serve

