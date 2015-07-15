'use strict';

describe('controllers', function(){
  var controller, translate, gridConstants, gridCtrl, gridApiFromUIGrid, selectedCount = 0;	

  beforeEach(module('ui.grid', 'ui.grid.selection','ui.grid.autoResize','ui.grid.resizeColumns', 'ui.grid.exporter', 'ui.select','isteven-multi-select', 'ui'));

  beforeEach(inject(function($controller, $translate, uiGridConstants) {
	  controller = $controller;
	  translate = $translate;
	  gridConstants = uiGridConstants;
	  var gridApi = {
				selectedFunction : function(){}
		};
		
		var gridOptions = {};
	    gridApiFromUIGrid = {
	    		grid : {selection : {selectedCount:selectedCount}},
	    		selection : {
	    			getSelectedRows : function(){return selectedCount;},
	    			clearSelectedRows : function(){selectedCount = 0;}, 
	    			on : {
	    				rowSelectionChanged : function(){

	    				},
	    				rowSelectionChangedBatch : function(){
	    					
	    				}
	    			}	
	    		}		
	    };

	    gridCtrl = controller('gridCtrl', {$translate : translate ,uiGridConstants : gridConstants}, 
	    		{gridOptions : gridOptions, gridApi : gridApi});
  }));

  it('should define all methods in gridApi', function() {
    expect(gridCtrl.gridOptions.onRegisterApi).toBeDefined();
    gridCtrl.gridOptions.onRegisterApi(gridApiFromUIGrid);
    expect(gridCtrl.gridApi.selectedFunction).toBeDefined();
    expect(gridCtrl.gridApi.selection).toBeDefined();
    expect(gridCtrl.gridApi.isRowsSelected).toBeDefined();
    expect(gridCtrl.gridApi.rowsSelectedCount).toBeDefined();
    expect(gridCtrl.gridApi.clearAllSelected).toBeDefined();
    expect(gridCtrl.gridApi.getSelectedRows).toBeDefined();
    expect(gridCtrl.getCellClass).toBeDefined();
  });
  
  it('call isRowsSelected method', function() {
	  gridCtrl.gridOptions.onRegisterApi(gridApiFromUIGrid);
	  expect(gridCtrl.gridApi.isRowsSelected()).toBe(false);
	  gridCtrl.gridApi.grid.selection.selectedCount = 1;
	  expect(gridCtrl.gridApi.isRowsSelected()).toBe(true);
  });
  
  it('call rowsSelectedCount method', function() {
	  gridCtrl.gridOptions.onRegisterApi(gridApiFromUIGrid);
	  expect(gridCtrl.gridApi.rowsSelectedCount()).toBe(0);
	  gridCtrl.gridApi.grid.selection.selectedCount = 1;
	  expect(gridCtrl.gridApi.rowsSelectedCount()).toBe(1);
  });
  
  it('call clearAllSelected method', function() {
	  gridCtrl.gridOptions.onRegisterApi(gridApiFromUIGrid);
	  selectedCount = 2;
	  gridCtrl.gridApi.clearAllSelected();
	  expect(selectedCount).toBe(0);
  });
  
  it('call getSelectedRows method', function() {
	  gridCtrl.gridOptions.onRegisterApi(gridApiFromUIGrid);
	  expect(gridCtrl.gridApi.getSelectedRows()).toBe(0);
	  selectedCount = 1;
	  expect(gridCtrl.gridApi.getSelectedRows()).toBe(1);
  });
  
  it('test getCellClass', inject(function(columnGrid) {
	    var accountName =  {name:'account_name' , title : 'CAMPAIGNS.TITLE.ACCOUNT_NAME', 'filterType' : 'input', values : {
	    	'approved' : {
				  'style' : 'fa fa-thumbs-o-up',
				  'label' : 'APPROVAL.MENU.APPROVED', 	 
			  },
			  'pending' : {
				  'style' : 'fa fa-question-circle',
				  'label' : 'APPROVAL.MENU.PENDING',
			  },
			  'rejected' : {
				  'style' : 'fa fa-thumbs-o-down',
				  'label' : 'APPROVAL.MENU.REJECTED',
			  }
	    }};
		var campaignName = {'name' : 'name','title' : 'CAMPAIGNS.TITLE.CAMPAIGN_NAME', 'filterType' : 'input', 'cellType' : 'clickable', 'linkParams' : 'campId'};
		
		var gridOptions = columnGrid.getGridOptions([campaignName, accountName]);
	    gridCtrl.gridOptions.columnDefs = gridOptions.columnDefs;
	    var col = {};
	    col.colDef = gridCtrl.gridOptions.columnDefs[1];
	    expect(gridCtrl.gridOptions.onRegisterApi).toBeDefined();
	    expect(gridCtrl.getCellClass).toBeDefined();
	    expect(gridCtrl.getCellClass('approved',col)).toEqual('fa fa-thumbs-o-up');
	    expect(gridCtrl.getCellClass('pending',col)).toEqual('fa fa-question-circle');
	    expect(gridCtrl.getCellClass('rejected',col)).toEqual('fa fa-thumbs-o-down');
	    expect(gridCtrl.getCellClass('s',col)).toBeUndefined();
	  }));
});

