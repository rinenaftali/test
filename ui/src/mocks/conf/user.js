'use strict';

var apis = require('../apis');

function login(latency) {
    return {
        'request': apis.createPOSTRequest('/login','naftali'),
        'response': apis.createJSONResponse('/user/login.succ.json', 200, latency)
    };
}
function loginError(latency) {
    return {
    	'request': apis.createPOSTRequest('/login','error'),
        'response': apis.createJSONResponse('/user/login.error.json', 401, latency)
    };
}



module.exports = [login(),loginError()];
