'use strict';
angular.module('ui')
.constant('baseUrl', '/v1/se/')
.factory('userService', function($resource, baseUrl){
	return $resource(null, {}, {
		logIn: {
	      method: 'POST',
	      url: baseUrl + 'login',
	    }
	  });
  })
  .factory('keywordsService', function($resource, baseUrl){
	return $resource(null, {}, {
		getApprovalKeywords: {
	      method: 'GET',
	      url: baseUrl + 'crs/:cr_id'
	    },
	    putApprovalKeywords: {
		      method: 'PUT',
		      url: baseUrl + 'crs/:cr_id'
		},
	    getCampaignsDetails: {
		      method: 'GET',
		      url: baseUrl + 'accounts'
		      
		},
		changhRequestAction: {
		      method: 'POST',
		      url: baseUrl + 'crs/'
		      
		}
	    
	  });
  })
;