'use strict';
angular.module('ui')
  .directive('ccGrid', function(){
	  return {
          restrict: 'EA',
          replace: false,
          scope: {},
          bindToController : {gridOptions: '=' , gridApi : '='},
          templateUrl: 'components/grid/grid.html',
          controller: 'gridCtrl as grid'
	  };
  })
  .config(function ($provide) {
	  $provide.decorator('uiGridSelectionRowHeaderButtonsDirective', function($delegate){
		  var directive = $delegate[0];
		  directive.template = '<div><md-checkbox ng-class="{\'ui-grid-row-selected\': row.isSelected}" ng-disabled="grid.appScope.grid.isDisabled(row)" ng-click="selectButtonClick(row, $event) ; !grid.appScope.grid.isDisabled(row) ? row.isSelected = !row.isSelected: row.isSelected = false" ng-model="row.isSelected" aria-label="select"></md-checkbox></div>';
		  return $delegate;  
	  });
	  $provide.decorator('uiGridSelectionSelectAllButtonsDirective', function($delegate){
		  var directive = $delegate[0];
		  directive.template = '<div ><md-checkbox ng-class="{\'ui-grid-row-selected\': row.isSelected}" ng-disabled="grid.appScope.grid.isDisabled()" ng-click="!grid.appScope.grid.isDisabled() ? headerButtonClick($event) : grid.selection.selectAll = false ; !grid.appScope.grid.isDisabled() ? grid.selection.selectAll = !grid.selection.selectAll : grid.selection.selectAll = false" ng-model="grid.selection.selectAll" aria-label="all"></md-checkbox></div>';
		  return $delegate;  
	  });
  })
  ;
 

