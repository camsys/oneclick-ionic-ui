#!/usr/bin/env bash

environment=dev

client=211ride
iconimagename=211-ride@1x.png
backgroundimagename=GettyImages-930896740_sized.png

s3bucket=s3://ui-lynx-dev
awsprofile=lynx
prodflag=

#copy index.html.tmpl to replace google api key
sed 's/GOOGLE_API_KEY/AIzaSyAELZ3K_3wIKhJwkwRjt8l1aCxGOFIQdhY/' ../index.html.tmpl > ../../src/index.html


source ../common.sh
