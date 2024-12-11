#!/usr/bin/env bash

client=hopelink
iconimagename=hopelink_icon.png
backgroundimagename=hopelink_background.png
environment=local

#copy index.html.tmpl to replace google api key
sed 's/GOOGLE_API_KEY/{{REPLACE_WITH_KEY}}/' ../index.html.tmpl > ../../src/index.html


source ../local-common.sh
