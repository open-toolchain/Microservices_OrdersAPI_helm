#!/bin/bash
GRUNTFILE="./tests/Gruntfile.js"
if [ -f $GRUNTFILE ]; then
  export PATH=/opt/IBM/node-v6.7.0/bin:$PATH
  npm install
  npm install -g grunt-cli

  set +e
  grunt dev-test-cov --no-color --gruntfile $GRUNTFILE --base .
  grunt_result=$?
  set -e

  ibmcloud login --apikey $IBM_CLOUD_API_KEY --no-region
  ibmcloud doi publishtestrecord --logicalappname="$APP_NAME" --buildnumber=$BUILD_NUMBER --filelocation=./tests/server/mochatest.xml --type=unittest
  ibmcloud doi publishtestrecord --logicalappname="$APP_NAME" --buildnumber=$BUILD_NUMBER --filelocation=./tests/server/coverage/reports/coverage-summary.json --type=code

  if [ $grunt_result -ne 0 ]; then
    exit $grunt_result
  fi
else
  echo "$GRUNTFILE not found."
fi
