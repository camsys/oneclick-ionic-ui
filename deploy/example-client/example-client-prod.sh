#!/usr/bin/env bash

environment=prod

client=hopelink
iconimagename=hopelink_icon.png
backgroundimagename=hopelink_background.png

s3bucket=s3://ui-hopelink-prod
awsprofile=example-client-profile
prodflag=--prod

#copy index.html.tmpl to replace google api key
#using restricted key!
sed 's/GOOGLE_API_KEY/{{REPLACE_WITH_KEY}}/' ../index.html.tmpl > ../../src/index.html

source ../common.sh
