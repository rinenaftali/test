'use strict';
angular.module('ui')
	.factory('authenticationService', function($window) {
	    return {
	        get: function(){
	        	return $window.localStorage.token;
	        },
	        set : function (token){
	        	if(token){
	        		$window.localStorage.token = token;
	        	}else{
	        		delete $window.localStorage.token;
	        	}
	        }
	        
	    };
	})
	.factory('authInterceptor', function ($rootScope, $q,$log, $timeout, $injector, authenticationService, baseUrl) {
		var state; 
		 $timeout(function () {
		      state = $injector.get('$state');
		    });
	  return {
	    request: function (config) {
	      config.headers = config.headers || {};
	      if(config.url.indexOf(baseUrl) === 0){
	    	  var token = authenticationService.get();
		      if (token) {
		        config.headers.Authorization = token;
		      }  
	      }
	      
	      return config;
	    },
	    response: function (response) {
	      if (response.status === 401) {
	    	  state.go('login');
	      }
	      if(response.headers('token') && response.config.url.indexOf(baseUrl) === 0){
	    	  authenticationService.set(response.headers('token'));
	      }
	      return response || $q.when(response);
	    },
        responseError: function(rejection) {
  	      if (rejection.status === 401) {
  	    	  state.go('login');
  	    	  if(state.current && state.current.name === 'login'){
  	    		return $q.reject(rejection);
  	    	  }else{
  	    		return rejection || $q.when(rejection);
  	    	  }
  	    	  
  	      }
  	    return $q.reject(rejection);
        }
	  };
	})
	.config(function ($httpProvider) {
	  $httpProvider.interceptors.push('authInterceptor');
	})
;