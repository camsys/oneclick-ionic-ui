#!/usr/bin/env bash

environment=sandbox

client=example-client
iconimagename=example-client_icon.png
backgroundimagename=example-client_background.png

s3bucket=s3://ui-example-client-sandbox
awsprofile=example-client-profile
prodflag=--prod

#copy index.html.tmpl to replace google api key
#using restricted key!
sed 's/GOOGLE_API_KEY/{{REPLACE_WITH_KEY}}/' ../index.html.tmpl > ../../src/index.html

source ../common.sh
