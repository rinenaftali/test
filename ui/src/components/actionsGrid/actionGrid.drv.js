'use strict';
angular.module('ui')
  .directive('ccActionGrid', function(){
	  return {
          restrict: 'EA',
          replace: false,
          scope: {gridOptions: '=' , gridApi : '=' , actions : '=', generalActions : '='}, 
          templateUrl: 'components/actionsGrid/actionGrid.html',
          controller: 'actionGridCtrl as actionGrid'
	  };
  })
  ;
 

