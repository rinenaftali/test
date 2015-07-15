#!/bin.bash
if  [[ $CIRCLE_BRANCH == master ]] || [[ $CIRCLE_BRANCH == ui-* ]] ; then
    cd ui && gulp jshint
    cd ui && gulp test
    cd ui && gulp protractor		
fi


