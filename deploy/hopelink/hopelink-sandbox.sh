#!/usr/bin/env bash

environment=sandbox

client=hopelink
iconimagename=hopelink_icon.png
backgroundimagename=hopelink_background.png

s3bucket=s3://ui-hopelink-sandbox
awsprofile=hope
prodflag=--prod

#copy index.html.tmpl to replace google api key
#using restricted key!
sed 's/GOOGLE_API_KEY/AIzaSyD-IDRbL8bFdNHkSlU1hOCGepPaHXP-hRc/' ../index.html.tmpl > ../../src/index.html

source ../common.sh
