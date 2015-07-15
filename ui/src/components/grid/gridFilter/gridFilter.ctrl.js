'use strict';
angular.module('ui')
.controller('gridFilterCtrl', function($scope, $translate, $filter) {
	$scope.data = {};
	$scope.data.output = [];
	function refreshTerm(){
		$scope.colFilter.term = [];
		angular.forEach($scope.data.output, function(row) {
			$scope.colFilter.term.push(row.value);
		});
	}
	function getFilterData(){
		$scope.data.rows = [];
		var rowsSet = {};
		angular.forEach($scope.grid.rows, function(row) {
			var value = row.entity[$scope.col.colDef.name];
			if($scope.col.colDef.type === 'date'){
				if(value){
					value = $filter('date')(value, 'yyyy-MM-dd HH:mm:ss');	
				}
			}
			if(value){
				this[value] = true; 	
			}
		  }, rowsSet);
		for (var item in rowsSet){
			$scope.data.rows.push({value :item, selected : true});
		} 
	} 
	
	if ($scope.colFilter.type === 'selectValues'){
		$scope.$watch(function() { return $scope.data.output.length;}, function() {
			refreshTerm();
		});
		
		$scope.$watch(function() { return $scope.grid.rows.length;}, function() {
			getFilterData();
		});
		
		$scope.$watch(function(){
			return $scope.colFilter.refresh;
			}, function(value) {
			if(value){
				getFilterData();
				refreshTerm();
			}
			$scope.colFilter.refresh = false;
		});
	}
	
	if ($scope.colFilter.type === 'multiSelect' || $scope.colFilter.type === 'selectValues'){
		$scope.$watch(function() { return $scope.data.output.length;}, function() {
			refreshTerm();
		});
		
		$scope.$watch(function(){
			return $scope.colFilter.refresh;
			}, function(value) {
			if(value){
				refreshTerm();	
			}
			$scope.colFilter.refresh = false;
		});
		
		
	}	
	
	$scope.localLang = {
		    selectAll       : $translate.instant('GRID.SELECT_VALUES.SELECT_ALL'),
		    selectNone      : $translate.instant('GRID.SELECT_VALUES.SELECT_NONE'),
		    reset           : $translate.instant('GRID.SELECT_VALUES.RESET'),
		    search          : $translate.instant('GRID.SELECT_VALUES.SEARCH'),
		    nothingSelected : $translate.instant('GRID.SELECT_VALUES.NOTHING_SELECT')
		};
	
	$scope.convertValue = function(value, type){
		if(type === 'date'){
			return new Date(value).toLocaleString();	
		}else{
			return value;
		}
	};
});

