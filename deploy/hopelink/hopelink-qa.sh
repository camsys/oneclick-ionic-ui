#!/usr/bin/env bash

environment=qa

client=hopelink
iconimagename=hopelink_icon.png
backgroundimagename=hopelink_background.png

s3bucket=s3://ui-hopelink-qa
awsprofile=hope
prodflag=--prod

#copy index.html.tmpl to replace google api key
sed 's/GOOGLE_API_KEY/AIzaSyAELZ3K_3wIKhJwkwRjt8l1aCxGOFIQdhY/' ../index.html.tmpl > ../../src/index.html


source ../common.sh
