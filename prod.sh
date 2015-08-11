#!/bin/bash
# Usage: prod.sh 'platform'
# 
echo "Compilation Application"
gulp prod
echo "Rename Folder to Minify Application"
mv www temp
mv dist www
echo "Build platform"
ionic run $* --device
echo "Rename folder"
mv www dist
mv temp www