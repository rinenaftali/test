'use strict';
angular.module('ui')
.controller('gridCtrl', function($translate, uiGridConstants, uiGridExporterConstants) {
	var scope = this;
	scope.getTableHeight = function() {
		var rowHeight = 30; // your row height
		var headerHeight = 80; // your header height
		var minRow = 10;
		// if not rows the height is default.
		if(scope.gridOptions.data && scope.gridOptions.data.length  > minRow){
			return {
				'max-height': (scope.gridOptions.data.length * rowHeight + headerHeight) + 'px'
			};	
		}
	};

	scope.gridOptions.onRegisterApi = function(gridApi){
		//set gridApi on scope
		angular.extend(scope.gridApi, gridApi);

		if(scope.gridApi.selectedFunction){
			scope.gridApi.selection.on.rowSelectionChanged(null, scope.gridApi.selectedFunction);
			scope.gridApi.selection.on.rowSelectionChangedBatch(null, scope.gridApi.selectedFunction);	
		}
		
		scope.gridApi.isRowsSelected = function(){
			return scope.gridApi.grid.selection.selectedCount > 0;  
		};
		
		scope.gridApi.clearAllFilters = function(){
			return scope.gridApi.grid.clearAllFilters();  
		};
		
		scope.gridApi.rowsSelectedCount = function(){
			return scope.gridApi.grid.selection.selectedCount;  
		};

		scope.gridApi.clearAllSelected = function(){
			scope.gridApi.selection.clearSelectedRows();	
		};

		scope.gridApi.getSelectedRows = function(){
			return scope.gridApi.selection.getSelectedRows();	
		};
		
		scope.gridApi.csvExport = function(){
			return scope.gridApi.exporter.csvExport(uiGridExporterConstants.VISIBLE);	
		};
	};
	
	scope.isDisabled = function(row) {
		return !scope.gridOptions.isRowSelectable(row);
	};
	
	scope.getCellClass = function(value , col) {	
		var columnWithStyle = col.colDef.values;
		if(columnWithStyle && columnWithStyle[value]){
			return columnWithStyle[value].style;	
		}
	};
	
	scope.getAdditionalValue = function(row , col) {
		 if(col.colDef.additionalValue){
			 return col.colDef.additionalValue(row);	 
		 }
		  return; 
	};
	scope.getCellValue = function(value , col) {
		if (col.colDef.type === 'date'){
			value = new Date(value).toLocaleString();
		}
		var columnValues = col.colDef.values;
		if(columnValues && columnValues[value] && columnValues[value].label){
			return $translate.instant(columnValues[value].label);	
		}else {
			return value || col.colDef.empty;	
		}
	};
	scope.gridOptions.enableFiltering = true;
	scope.gridOptions.enableColumnMenus = false;
	scope.gridOptions.enableGridMenu = false;
	scope.gridOptions.exporterCsvFilename = 'cclearly.csv';
	scope.gridOptions.gridMenuShowHideColumns = false;
	scope.gridOptions.enableColumnResizing = false;
	scope.gridOptions.enableFullRowSelection = false;
	scope.gridOptions.enableHorizontalScrollbar = uiGridConstants.scrollbars.NEVER;
//	scope.gridOptions.gridMenuCustomItems = [
//	                                         {
//	                                        	 title: $translate.instant('GRID.ENABLE_FILTER'),
//	                                        	 action: function () {
//	                                        		 scope.gridOptions.enableFiltering = !scope.gridOptions.enableFiltering;
//	                                        		 scope.gridApi.core.notifyDataChange( uiGridConstants.dataChange.COLUMN );
//	                                        	 }
//	                                         }
//	                                         ];
	  
	
});

