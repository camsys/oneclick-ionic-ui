#!/usr/bin/env bash

environment=prod

client=hopelink
iconimagename=hopelink_icon.png
backgroundimagename=hopelink_background.png
src_deploy_dir=**FULL-PATH-TO**/oneclick-ionic-ui/deploy

s3bucket=s3://ui-hopelink-prod
awsprofile=example-client-profile
prodflag=--prod

#copy index.html.tmpl to replace google api key
#using restricted key!
sed 's/GOOGLE_API_KEY/{{REPLACE_WITH_KEY}}/' $src_deploy_dir/index.html.tmpl > $src_deploy_dir/../src/index.html

source $src_deploy_dir/common.sh
