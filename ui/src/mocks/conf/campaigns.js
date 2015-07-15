'use strict';

var apis = require('../apis');

function getApprovalKeywords(campaignId) {
    return {
        'request': apis.createGETRequest('/crs/' + campaignId),
        'response': apis.createJSONResponse('/campaigns/keywords_' + campaignId + '.json', 200)
    };
}
function setApprovalKeywords(campaignId) {
    return {
        'request': apis.createPUTRequest('/crs/' + campaignId),
        'response': apis.createResponse('', 200)
    };
}

function getAccountDetails() {  
    return {
        'request': apis.createGETRequest('/accounts'),
        'response': apis.createJSONResponse('/campaigns/campaigns.json', 200)
    };
}

function changhRequestAction() {  
    return {
        'request': apis.createPOSTRequest('/crs'),
        'response': apis.createResponse('', 200)
    };
}


module.exports = [getApprovalKeywords(1),getApprovalKeywords(2),setApprovalKeywords(1),setApprovalKeywords(2),getAccountDetails(),changhRequestAction()];
