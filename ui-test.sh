#!/bin.bash
if  [[ $CIRCLE_BRANCH == master ]] || [[ $CIRCLE_BRANCH == ui-* ]] ; then
    cd ui
	gulp jshint
	gulp jshint
	gulp protractor		
fi


