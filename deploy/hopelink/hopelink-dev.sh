#!/usr/bin/env bash

environment=dev

client=hopelink
iconimagename=hopelink_icon.png
backgroundimagename=hopelink_background.png

s3bucket=s3://ui-hopelink-dev
awsprofile=hope
prodflag=--prod

#copy index.html.tmpl to replace google api key
sed 's/GOOGLE_API_KEY/AIzaSyAELZ3K_3wIKhJwkwRjt8l1aCxGOFIQdhY/' ../index.html.tmpl > ../../src/index.html


source ../common.sh
