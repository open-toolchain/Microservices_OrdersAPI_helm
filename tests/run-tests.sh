#!/bin/bash
GRUNTFILE="./tests/Gruntfile.js"
if [ -f $GRUNTFILE ]; then
export PATH=/opt/IBM/node-v4.2/bin:$PATH
npm install -g npm@3.7.2 ### work around default npm 2.1.1 instability
npm install
npm install -g grunt-idra3

set +e
grunt dev-test-cov --no-color --gruntfile $GRUNTFILE --base .
grunt_result=$?
set -e

build_status="pass"
if [ $grunt_result -ne 0 ]; then
    build_status="fail"
fi
idra --publishbuildrecord --branch=$GIT_BRANCH --repositoryurl=$GIT_URL --commitid=$GIT_COMMIT --status=$build_status

idra --publishtestresult --filelocation=./tests/server/mochatest.xml --type=unittest
idra --publishtestresult --filelocation=./tests/server/coverage/reports/coverage-summary.json --type=code

if [ $grunt_result -ne 0 ]; then
    exit $grunt_result
fi
else
echo "$GRUNTFILE not found."
fi
