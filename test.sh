#!/bin.bash
if  [[ $CIRCLE_BRANCH == master ]] || [[ $CIRCLE_BRANCH == ui-* ]] ; then
    - npm install -g gulp
    - npm install -g bower
    - cd ui && npm install
    - cd ui && bower install
fi


