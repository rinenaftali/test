'use strict';
angular.module('ui')
	.value('gridCellTemplate', {
		icon : '<div class="ui-grid-cell-contents" ng-class="grid.appScope.grid.getCellClass(COL_FIELD CUSTOM_FILTERS, col)" title="TOOLTIP"></div>',
		clickable : '<div class="ui-grid-cell-contents" title="TOOLTIP"><a ui-sref="approval({{0}:row.entity.id})">{{COL_FIELD CUSTOM_FILTERS}}</a></div>',
		date : '<div class="ui-grid-cell-contents" title="TOOLTIP">{{grid.appScope.grid.getCellValue(COL_FIELD CUSTOM_FILTERS, col)}}</div>',
		defaultCell : '<div class="ui-grid-cell-contents" title="TOOLTIP"><span>{{grid.appScope.grid.getCellValue(COL_FIELD CUSTOM_FILTERS, col)}}<span style="padding-left:20px;font-size: small;">{{grid.appScope.grid.getAdditionalValue(row, col)}}</span></span>'
	})	
  .factory('columnGrid', function($translate , $filter, uiGridConstants, gridCellTemplate){
	  function select(defColumn){
    	  var selectMenu = [],
    	  row;
    	  
    	  angular.forEach(defColumn.values, function(value,key) {
    		  row = {
    				  	value : key,
    				  	label : $translate.instant(value.label),
    				  	style : value.style
    				  };	
    		  this.push(row);
    	  }, selectMenu);
    	    
    	  return {
    		  type: uiGridConstants.filter.SELECT, 
    		  selectOptions: selectMenu,
    		  searchEnabled : defColumn.searchEnabled
    	  };
      }
	  
	  function multiSelect(defColumn){
    	  var selectMenu = [],
    	  row;
    	  
    	  angular.forEach(defColumn.values, function(value,key) {
    		  row = {
    				  	value : key,
    				  	label : $translate.instant(value.label),
    				  	style : value.style,
    				  	selected : value.selected 
    				  };	
    		  this.push(row);
    	  }, selectMenu);
    	    
    	  return {
    		  refresh : false,
    		  type: 'multiSelect', 
    		  selectOptions: selectMenu,
    		  condition: function(searchTerms, cellValue) {
    			  if (angular.isArray(searchTerms)){
    				  for (var key in searchTerms) {
    					  if(cellValue === searchTerms[key]){
    						  return true;
    					  }
    				  }
    				  return false;
    			  } else{
    				  return searchTerms === cellValue;
    			  } 
    		  }
    	  };
      }
	  
      function search(){
    	  return {
    		  type: uiGridConstants.filter.INPUT,
    		  condition: uiGridConstants.filter.CONTAINS
    	  };
      }
      
      function selectValues(){
    	  return {
    		  refresh : false,
    		  type: 'selectValues',
    		  condition: function(searchTerms, cellValue, row, column) {
    			  if (angular.isArray(searchTerms)){
    				  if(column.colDef.type === 'date'){
    					  cellValue = $filter('date')(cellValue, 'yyyy-MM-dd HH:mm:ss');	
    				  }
    				  for (var key in searchTerms) {
    					  if(cellValue === searchTerms[key]){
    						  return true;
    					  }
    				  }
    				  return false;
    			  } else{
    				  return searchTerms === cellValue;
    			  } 
    		  }
    	  };
      }
      function selectValuesSingle(defColumn){
    	  return {
    		  type: 'selectValuesSingle',
    		  searchEnabled : defColumn.searchEnabled, 
    		  condition: function(searchTerms, cellValue, row, column) {
    			  if(!cellValue){
    				  cellValue = $translate.instant(column.colDef.empty);
    			  }
    			  if(column.colDef.type === 'date'){
    				  return searchTerms.split('\\').join('') === cellValue;  
    			  } 
    				 return searchTerms === cellValue;
    		  }
    	  };    	  
      }
      
      function selectValuesTags(){
    	  return {
    		  type: 'selectValuesTags',
    		  condition: function(searchTerms, cellValue) {
    			  if (angular.isArray(searchTerms)){
    				  if(searchTerms.length === 0){
    					  return true;
    				  }
    				  for (var key in searchTerms) {
        				  if(cellValue === searchTerms[key]){
        					  return true;
        				  }
        			  }
        	            return false;
        	          } else{
        	        	  return searchTerms === cellValue;
        	          } 
    			  }
    			  
    	  };
      }

      function getFilterTemplate(){
    	  return 'components/grid/gridFilter/gridFilter.html';
      }
      
      function getRowTemplate(){
    	  return '<div ng-repeat=\"(colRenderIndex, col) in colContainer.renderedColumns track by col.uid\" class=\"ui-grid-cell\" ng-class=\"{ \'ui-grid-row-header-cell\': col.isRowHeader , disabled : grid.appScope.grid.isDisabled(row)}\" ui-grid-cell></div>';
      }
      
      function getCellTemplate(cellType, linkParams){
    	  if(cellType){
    		  if(cellType === 'clickable'){
    			  return gridCellTemplate[cellType].replace('{0}', linkParams); // TODO create string format function  
    		  }else {
    			  return gridCellTemplate[cellType];
    		  }
    		  
    	  }
    	  return null;
      }	  
      
      function getColumn(defColumn){	
    	  var filters = [], maxWidth;
    	  if(defColumn.filterType){
    		  if (defColumn.filterType === uiGridConstants.filter.SELECT){
    			  filters.push(select(defColumn));
    		  }else if (defColumn.filterType === 'input'){
    			  filters.push(search());
    		  }else if (defColumn.filterType === 'selectValues'){
    			  filters.push(selectValues());
    		  }else if (defColumn.filterType === 'multiSelect'){
    			  filters.push(multiSelect(defColumn));
    		  }else if (defColumn.filterType === 'selectValuesSingle'){
    			  filters.push(selectValuesSingle(defColumn));
    		  }else if (defColumn.filterType === 'selectValuesTags'){
    			  filters.push(selectValuesTags());
	    	  }else if (defColumn.filterType === 'selectValuesAndInput'){
				  filters.push(search());
				  filters.push(selectValues());
			  }
    	  }
      
    	  maxWidth = defColumn.icon? 80 : null;
    	  var column = {
    			  allowCellFocus : false,
    			  type : defColumn.type || 'string',
    			  cellType : defColumn.cellType,
    			  additionalValue : defColumn.additionalValue,
    			  values : defColumn.values,
    			  enableFiltering: true,
    			  sort : defColumn.sort ? {
    		          direction: uiGridConstants.ASC,
    		        }:null,
		    	  name: defColumn.name,
		    	  headerTooltip: $translate.instant(defColumn.tooltip),
		    	  cellTooltip: defColumn.icon? true : false,
		    	  cellTemplate : getCellTemplate(defColumn.cellType? defColumn.cellType: 'defaultCell', defColumn.linkParams),		  
		    	  displayName: $translate.instant(defColumn.title),
		    	  filters: filters,
		    	  filterHeaderTemplate: getFilterTemplate(),
		    	  maxWidth : maxWidth,
		    	  empty : $translate.instant(defColumn.empty),
		    	  cellClass : defColumn.icon? 'fa-fw' : ''
		      };  
    	  return column;
      }
	  return {
	  	  getGridOptions : function(columns){
	  		var columnDefs = [],
	  		gridOptions = {};
	  		
	  		angular.forEach(columns, function(column) {
		    	  this.push(getColumn(column));
	  		 },columnDefs);
	  		
	  		gridOptions.columnDefs = columnDefs;
	  		gridOptions.rowTemplate = getRowTemplate();
//	  		gridOptions.rowTemplate = dbClick?'<div ng-repeat="(colRenderIndex, col) in colContainer.renderedColumns track by col.uid" class="ui-grid-cell" ng-dblclick="grid.appScope.gridApi.dbClick(row.entity)" ng-class="{ \'ui-grid-row-header-cell\': col.isRowHeader }"  ui-grid-cell></div>':null;
	  		
	  		return gridOptions;
	  	  }	
	  };
  })
;
 

