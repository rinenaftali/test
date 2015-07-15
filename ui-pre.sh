#!/bin.bash
if  [[ $CIRCLE_BRANCH == master ]] || [[ $CIRCLE_BRANCH == ui-* ]] ; then
    npm install -g gulp
    npm install -g bower
    cd ui 
    npm install
    bower install
    sudo apt-get update && sudo apt-get install --only-upgrade google-chrome-stable
fi


