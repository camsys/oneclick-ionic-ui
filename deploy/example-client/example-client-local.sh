#!/usr/bin/env bash

client=hopelink
iconimagename=hopelink_icon.png
backgroundimagename=hopelink_background.png
environment=local
src_deploy_dir=**FULL-PATH-TO**/oneclick-ionic-ui/deploy

#copy index.html.tmpl to replace google api key
sed 's/GOOGLE_API_KEY/{{REPLACE_WITH_KEY}}/' $src_deploy_dir/index.html.tmpl > $src_deploy_dir/../src/index.html


source $src_deploy_dir/local-common.sh
