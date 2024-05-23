#!/usr/bin/env bash

environment=dev

client=finger-lakes
iconimagename=finger-lakes_icon.png
backgroundimagename=finger-lakes_background.png

s3bucket=s3://ui-livingston-dev
awsprofile=fingerlakes
prodflag=--prod

#copy index.html.tmpl to replace google api key
sed 's/GOOGLE_API_KEY/AIzaSyAELZ3K_3wIKhJwkwRjt8l1aCxGOFIQdhY/' ../index.html.tmpl > ../../src/index.html

source ../common.sh
