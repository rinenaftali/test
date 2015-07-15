'use strict';
angular.module('ui')
  .directive('navbarDrv', function(){
	  return {
          restrict: 'EA',
          replace: false,
          scope: {buttons: '=', titles: '='}, 
          templateUrl: 'components/navbar/navbar.html',
          controller : 'navbarCtrl'
	  };
  });
 

