#!/bin/bash
GRUNTFILE="./tests/Gruntfile.js"
if [ -f $GRUNTFILE ]; then
  export PATH=/opt/IBM/node-v6.7.0/bin:$PATH
  npm install
  npm install -g grunt-idra3

  set +e
  grunt dev-test-cov --no-color --gruntfile $GRUNTFILE --base .
  grunt_result=$?
  set -e

  idra --publishtestresult --filelocation=./tests/server/mochatest.xml --type=unittest
  idra --publishtestresult --filelocation=./tests/server/coverage/reports/coverage-summary.json --type=code

  if [ $grunt_result -ne 0 ]; then
    exit $grunt_result
  fi
else
  echo "$GRUNTFILE not found."
fi
