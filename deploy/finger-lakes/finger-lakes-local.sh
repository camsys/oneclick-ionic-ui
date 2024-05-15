#!/usr/bin/env bash

client=finger-lakes
iconimagename=finger-lakes_icon.png
backgroundimagename=finger-lakes_background.png
environment=local

#copy index.html.tmpl to replace google api key
sed 's/GOOGLE_API_KEY/AIzaSyAELZ3K_3wIKhJwkwRjt8l1aCxGOFIQdhY/' ../index.html.tmpl > ../../src/index.html

source ../local-common.sh
