'use strict';
angular.module('ui')
	 .controller('loginCtrl', function($rootScope ,$scope, $state, $mdToast,$log ,userService, authenticationService) {
		 $scope.feedback = {};
		 function getLogin(username, password, state){
			 userService.logIn({username:username,password:password},function(data) {
				  authenticationService.set(data.token);
				  $state.go(state, $rootScope.returnToStateParams);
				  $log.log('sucssed');
			  },function(error) {
				  $log.log(error);
				  $scope.feedback.messege = 'MAIN.ERROR_LOGIN';
				  $scope.feedback.error = true;
				  delete $scope.password;
				  delete $scope.username;
				  authenticationService.set();
			  });
		  }
		  
		 
		 $scope.logIn = function logIn() {
			 	var username = $scope.username,
			 		password = $scope.password;
	            if (username !== undefined && password !== undefined) {
	            	var state = $rootScope.returnToState || 'campaigns';
	            	getLogin(username, password, state);
	            }
	        };
    });
