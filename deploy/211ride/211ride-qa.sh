#!/usr/bin/env bash

environment=qa

client=211ride
iconimagename=211-ride@1x.png
backgroundimagename=GettyImages-930896740_sized.png

#s3bucket=s3://ui-ieuw-qa
s3bucket=s3://ui-211ride-qa
awsprofile=ieuw
prodflag=--prod

#copy index.html.tmpl to replace google api key
#using restricted key!
sed 's/GOOGLE_API_KEY/AIzaSyBMHn-cCkniYy8rX7QF_nNrhr8wuCKDeuI/' ../index.html.tmpl > ../../src/index.html

source ../common.sh
