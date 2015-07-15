'use strict';
angular.module('ui')
	.value('approvalAction', [
        {label: 'APPROVAL.ACTION.APPROVE', value: 'approved', action : 'approve' , class  :'fa fa-thumbs-o-up fa-2x', icon: true},
        {label: 'APPROVAL.ACTION.REJECT', value: 'rejected', action : 'reject', class  :'fa fa-thumbs-o-down fa-2x', icon: true},
        {label: 'APPROVAL.ACTION.RESET', value: 'pending', action : 'pending' ,class  :'fa fa-question-circle fa-2x', icon: true},
        {label: 'APPROVAL.ACTION.REASSIGN', value: 'pending', action : 'pending' ,class  :'fa fa-pencil-square-o fa-2x', icon: true},
        {label: 'APPROVAL.ACTION.SAVE', class  :'fa fa-floppy-o fa-2x'},
        {label: 'COMMON.ACTION.CSV', value: '', action : '' ,class : 'fa fa-file-excel-o fa-2x'}
    ])
    .value('availableActions', {
        approved : ['reject', 'pending'],
        rejected : ['approve', 'pending'],
        pending : ['approve', 'reject'],
    })
	 .controller('approvalCtrl', function($stateParams, $state, $log, ccDialog, keywordsService, approvalAction , availableActions ,columnGrid) {
		  var scope = this,
		  campaignId = $stateParams.campId,
		  currentlyActionAllow = {},
		  availableAdgroups = [],
		  updateAllow = false,
		  gridTitle = {value : 'APPROVAL.TITLE.GRID_TITLE', paramData:{}},
		  changes = {};
		  scope.buttons = [
				   	       {url:'campaigns', class: 'fa fa-angle-left fa-3x', type : 'button'},
				   	       {value : 'APPROVAL.PAGE_TITLE' , type : 'title'}
				   	  ];
		  scope.titles = [];
		  scope.gridApi = {};
		  scope.gridOptions = {};
		  scope.gridOptions.data = [];
		  scope.isDirty = function(){
			  return !isChanged();
		  };

		  var approvalType = {
				  'name' : 'keyword_match_type',
				  'title' : 'APPROVAL.TITLE.TYPE',
				  'filterType' : 'select',
				  'searchEnabled' : false,	
				  'values' : {
					  'broad' : {
						  'style' : '',
						  'label' : 'APPROVAL.MENU.BROAD', 	 
					  },
					  'phrase' : {
						  'style' : '',
						  'label' : 'APPROVAL.MENU.PHRASE',
					  },
					  'exact' : {
						  'style' : '',
						  'label' : 'APPROVAL.MENU.EXACT',
					  }}
		  };

		  var approvalStatus = {
				  'name' : 'status',
				  'title' : '',
				  'tooltip' : 'APPROVAL.TITLE.STATUS',
				  'filterType' : 'select',
				  'searchEnabled' : false,
				  'icon' : true, 
				  'cellType' : 'icon',
				  'values' : { 
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
					  }}
		  };

		  var approvalRecomended = {
				  'name' : 'action',
				  'title' : 'APPROVAL.TITLE.RECOMENDED',
				  'filterType' : 'select',
				  'searchEnabled' : false,
				  'values' : {
					  'add' : {
						  'style' : '',
						  'label' : 'APPROVAL.MENU.ADD_AD_GROUP', 	 
					  },
					  'remove' : {
						  'style' : '',
						  'label' : 'APPROVAL.MENU.REMOVED',
					  },
					  'unchanged' : {
						  'style' : '',
						  'label' : 'APPROVAL.MENU.UNCHANGED',
					  }}
		  };
		  
		  var keyword =  {name:'keyword' , title : 'APPROVAL.TITLE.KEYWORDS', filterType : 'input', sort : true};
		  var adgroup_name = {name:'adgroup_name' , title : 'APPROVAL.TITLE.AD_GROUP', filterType : 'selectValues'};// jshint ignore:line
		  scope.gridOptions = columnGrid.getGridOptions([approvalStatus,keyword,approvalRecomended,adgroup_name,approvalType]);// jshint ignore:line
		  
		  
		  var save = function(){
			  scope.gridOptions.loading = true;
			  var saveData = {};
			  saveData.cr_actions = [];// jshint ignore:line
			  angular.forEach(changes, function(value, key) {
				  this.push({'id' : key, 'status' : value.status, 'adgroup_name' : value.adGroup});
			  },saveData.cr_actions); // jshint ignore:line

			  keywordsService.putApprovalKeywords({cr_id : campaignId},saveData,// jshint ignore:line
					  function() {
				  cleanDataGrid();
				  loadDataGrid();
				  $log.log('sucssed');
			  },function(error) {
				  scope.gridOptions.loading = false;
				  ccDialog.error(error);
				  $log.log(error);
			  });
		  };

		  function csvExport(){
			  scope.gridApi.csvExport();  
		  }
		  
		  function setCurrentlyActionAllow(isSelected, status){
			  angular.forEach(availableActions[status], function(action) {// jshint ignore:line
				  if (!currentlyActionAllow[action]){
					  currentlyActionAllow[action] = 0;
				  }
				  if (isSelected){
					  currentlyActionAllow[action] ++;   
				  }else {
					  currentlyActionAllow[action] --;
				  }

			  });
		  } 
			 
		 var disabled = function(action){
			  if (scope.gridApi.isRowsSelected && updateAllow){
				  if(!scope.gridApi.isRowsSelected()){
					  return true;
				  } else {
					  return currentlyActionAllow[action.action] !== scope.gridApi.rowsSelectedCount(); 
				  } 
			  } else {
				  return true;
			  } 
		  };
		  
		  var isReassignDisabled = function(){
			  return !updateAllow || !scope.gridApi.isRowsSelected || !scope.gridApi.isRowsSelected();
		  };
		  
		 scope.gridApi.selectedFunction = function(value){
			  if (angular.isArray(value)){
				  angular.forEach(value, function(row) {
					  setCurrentlyActionAllow(row.isSelected , row.entity.status);
				  });
			  }else {
				  setCurrentlyActionAllow(value.isSelected , value.entity.status);
			  }
		  };
		  
		  scope.gridOptions.isRowSelectable = function(row){
			  return updateAllow && !row || updateAllow && row && row.entity && row.entity.action !== 'unchanged';
		  };
		      
		  var isChanged = function(){
			  return Object.keys(changes).length === 0;
		  };
		  
		  var setAdGroup =  function(selected){
			  var selectedRows = scope.gridApi.getSelectedRows();
			  angular.forEach(selectedRows , function(row) {
				  row.adgroup_name = selected;
				  if(!changes[row.id]){
					  changes[row.id] = {};
				  }
				  changes[row.id].adGroup = selected;
			  });
			  scope.gridApi.grid.columns[4].filters[0].refresh = true; 
		  };
		  
		  function getReassignData(){
				var rows = [];
				var rowsSet = {};
				angular.forEach(availableAdgroups , function(row) {
					var value = row;
					if(value){
						this[value] = true; 	
					}
				  }, rowsSet);
				for (var item in rowsSet){
					rows.push(item);
				} 
				return rows;
			} 
		  
		  var executeReassignAction = function($event){
			  var dialogData = {
					  options : getReassignData(),
					  okFunction : setAdGroup,
					  title : 'APPROVAL.REASSIGN.TITLE',
					  content: 'APPROVAL.REASSIGN.CONTENT'
			  };
			  ccDialog.selectDialog(dialogData,$event);
		  };

		  
		  var executeAction = function(event ,action){
			  var selectedRows = scope.gridApi.getSelectedRows();
			  currentlyActionAllow = {};
			  angular.forEach(selectedRows, function(row) {
			    row.status = action.value;
			    setCurrentlyActionAllow(true, row.status);
			    if(!changes[row.id]){
			    	changes[row.id] = {};
			    }
			    changes[row.id].status = action.value;
			  }); 
			 
		  };
		  
		  function loadDataGrid(){
			  if (campaignId){
				  scope.gridOptions.loading = true;
				  keywordsService.getApprovalKeywords({cr_id : campaignId},// jshint ignore:line
						  function(data) {
					  if(data){
						  scope.gridOptions.data = data.cr_actions; // jshint ignore:line
						  availableAdgroups = data.available_adgroups; // jshint ignore:line
						  updateAllow = (data.available_actions && data.available_actions.indexOf('update') !== -1);
						  gridTitle.paramData.campName = data.camp_name;// jshint ignore:line
						  gridTitle.paramData.accountName = data.seaccount_name;// jshint ignore:line
						  scope.titles.push(gridTitle);  
					  }else{
						  scope.gridOptions.data = [];
					  }
					  scope.gridOptions.loading = false;
					  $log.log('sucssed');
				  },function(error) {
					  ccDialog.error(error);
					  scope.gridOptions.loading = false;
					  cleanDataGrid();
					  $log.log(error);
				  });  
			  }  
		  }

		  scope.actions = [
		                   {data: approvalAction[0], executeAction : executeAction, disabled: disabled},
		                   {data: approvalAction[1], executeAction : executeAction, disabled: disabled},
		                   {data: approvalAction[2], executeAction : executeAction, disabled: disabled},
		                   {data: approvalAction[3], executeAction : executeReassignAction, disabled : isReassignDisabled}
		                   ]	  
		  ;

		  scope.generalActions = [
		                   {data: approvalAction[4], executeAction : save, disabled: isChanged},
		                   {data: approvalAction[5], executeAction : csvExport}
		                   ]	  
		  ;

		  function cleanDataGrid(){
			  changes = {};
			  scope.gridOptions.data = [];
			  scope.titles = [];
			  if(scope.gridApi.clearAllFilters){
				  scope.gridApi.clearAllFilters();
   				  scope.gridApi.clearAllSelected();
			  }
			  currentlyActionAllow = {};
		  }

		  loadDataGrid();
		 
    });
