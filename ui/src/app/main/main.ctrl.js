'use strict';
var uiApp = angular.module('uiApp'); 
	 uiApp.controller('mainCtrl', function() {
		 this.buttons=[
		   	       {url:'.',value: 'NAV_BAR.HOME',class: 'md-raised'},
		   	       {url:'approval',value: 'NAV_BAR.APPROVAL', class: 'md-raised'},
		   	       {url:'campaigns',value: 'NAV_BAR.CAMPAIGNS', class: 'md-raised'}	   	      
		   	  ];	 
	 });

	 