#!/usr/bin/env bash

environment=qa

client=finger-lakes
iconimagename=finger-lakes_icon.png
backgroundimagename=finger-lakes_background.png

s3bucket=s3://ui-livingston-qa
awsprofile=fingerlakes
prodflag=--prod

#copy index.html.tmpl to replace google api key
#using restricted key!
sed 's/GOOGLE_API_KEY/AIzaSyAvlI2BnZMv-lRQkKQsE6tTRShjW4rEXgI/' ../index.html.tmpl > ../../src/index.html

source ../common.sh
