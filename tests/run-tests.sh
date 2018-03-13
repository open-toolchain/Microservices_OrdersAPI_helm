#!/bin/bash

export PATH=/opt/IBM/node-v4.2/bin:$PATH
npm install -g npm@3.7.2 ### work around default npm 2.1.1 instability
npm install
npm install -g grunt-idra3

idra --publishtestresult --filelocation=./tests/mochatest.xml --type=unittest
idra --publishtestresult --filelocation=./tests/coverage/reports/coverage-summary.json --type=code
