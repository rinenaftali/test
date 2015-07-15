'use strict';
angular.module('ui')
	.value('campaignsAction', [
        {label: 'CAMPAIGNS.ACTION.APPROVE', value: 'approved', action : 'approve', class : 'md-raised'},
        {label: 'CAMPAIGNS.ACTION.SEND', value: 'sent', action : 'send' ,class : 'md-raised'},
        {label: 'CAMPAIGNS.ACTION.CANCEL', value: 'cancelled', action : 'cancel' ,class : 'md-raised'},
        {label: 'CAMPAIGNS.ACTION.UNAPPROVE', value: '', action : 'unapprove' ,class : 'md-raised'},
        {label: 'CAMPAIGNS.ACTION.UNCANCEL', value: '', action : 'uncancel' ,class : 'md-raised'},	
        {label: 'COMMON.ACTION.CSV', value: '', action : '' ,class : 'fa fa-file-excel-o fa-2x'}	
    ])
	 .controller('campaignslCtrl', function($log, $state, $q, $translate, ccDialog, keywordsService, campaignsAction , columnGrid) {
		  var scope = this,
		  currentlyActionAllow = {};
		  var accountName =  {name:'account_name' , title : 'CAMPAIGNS.TITLE.ACCOUNT_NAME', filterType : 'selectValues'};
		  var campaignName = {name : 'camp_name', title : 'CAMPAIGNS.TITLE.CAMPAIGN_NAME', filterType : 'selectValues', cellType : 'clickable', sort : true, linkParams : 'campId'};
		  var lastActionDate = {name : 'last_action_date', title : 'CAMPAIGNS.TITLE.LAST_UPDATE', cellType : 'date', type : 'date', filterType : 'selectValuesSingle' , empty : 'CAMPAIGNS.TITLE.EMPTY_DATE_VALUE', 'searchEnabled' : true};
		  
		  var getAdditionalValue = function(row){
			  if(row){
				  var summary = row.entity.actions_summary;
				  if (summary){
					  return $translate.instant('CAMPAIGNS.STATUS.STATUS_SUMMARY', {pendingNum : summary.pending || 0, rejectedNum : summary.rejected || 0 , approvedNum : summary.approved || 0});  
				  }
			  }
			  return;
		  };
		  
		  var status = {
				  'name' : 'status',
				  'title' : 'CAMPAIGNS.TITLE.STATUS',
				  'tooltip' : 'CAMPAIGNS.TITLE.STATUS',
				  'filterType' : 'multiSelect',
				  'additionalValue' : getAdditionalValue,
				  'searchEnabled' : false,
				  'values' : {
					  'pending' : {
						  'label' : 'CAMPAIGNS.STATUS.PENDING',
						  'selected' : true
					  },
					  'reviewed' : {
						  'label' : 'CAMPAIGNS.STATUS.REVIEWED',
						  'selected' : true
					  },
					  'approved' : {
						  'label' : 'CAMPAIGNS.STATUS.APPROVED',
						  'selected' : true
					  },
					  'sent' : {
						  'label' : 'CAMPAIGNS.STATUS.SENT',
						  'selected' : true
					  },
					  'pending send' :{
						  'label' : 'CAMPAIGNS.STATUS.PENDING_SEND',
						  'selected' : true
					  },
					  'deployed' : {
						  'label' : 'CAMPAIGNS.STATUS.DEPLOYED',
						  'selected' : false
					  },
					  'cancelled' : {
						  'label' : 'CAMPAIGNS.STATUS.CANCELLED',
						  'selected' : false
					  }}
		  };
		  scope.buttons = [{value : 'CAMPAIGNS.PAGE_TITLE', type : 'title'}];
		  scope.gridApi = {};
		  scope.gridOptions = columnGrid.getGridOptions([campaignName, accountName, lastActionDate ,status],true);
		  scope.gridOptions.data = [];

		  function cleanDataGrid(){
			  scope.gridOptions.data = [];
			  if(scope.gridApi.clearAllFilters) {
				  scope.gridApi.clearAllFilters();  
	  			  scope.gridApi.clearAllSelected();
			  }
			  currentlyActionAllow = {};
		  }
		  function loadDataGrid(){
			  angular.forEach(scope.accounts, function(account) {
				  angular.forEach(account.crs, function(campaign) {
				        var row = angular.copy(campaign);
				        row.account_name = account.name;// jshint ignore:line
				        this.push(row);
				  },scope.gridOptions.data);	
			  }); 
		  }
		  
		  function csvExport(){
			  scope.gridApi.csvExport();  
		  }
		  
		  function loadAllCampaigns(){
			  scope.gridOptions.loading = true;
			  keywordsService.getCampaignsDetails({},
					  function(data) {
				  scope.accounts = data ? data.accounts:[];
				  loadDataGrid();
				  scope.gridOptions.loading = false;
				  $log.log('succeeded');
			  },function(error) {
				  scope.accounts = [];
				  scope.gridOptions.loading = false;
				  ccDialog.error(error);
				  $log.log(error);
			  });
		  }
			 
		 function setCurrentlyActionAllow(row){
			  angular.forEach(row.entity.available_actions, function(action) {// jshint ignore:line
				  if (!currentlyActionAllow[action]){
					  currentlyActionAllow[action] = 0;
				  }
				  if (row.isSelected){
					  currentlyActionAllow[action] ++;   
				  }else {
					  currentlyActionAllow[action] --;
				  }

			  });
		  } 
		
		 scope.gridOptions.isRowSelectable = function(){
			  return true;
		  };
		 
		 var isActionDisable = function(action){
			  if (scope.gridApi.isRowsSelected){
				  if(!scope.gridApi.isRowsSelected()){
					  return true;
				  } else {
					  return currentlyActionAllow[action.action] !== scope.gridApi.rowsSelectedCount(); 
				  } 
			  } else {
				  return true;
			  } 
		  };
		  
		 scope.gridApi.selectedFunction = function(value){
			  if (angular.isArray(value)){
				  angular.forEach(value, function(row) {
					  setCurrentlyActionAllow(row);
				  });
			  }else {
				  setCurrentlyActionAllow(value);
			  }
		  };
		  
		  var actionOnGrig =  function(action){
			  var deferred = $q.defer();
			  var selectedRows = scope.gridApi.getSelectedRows(),
			    changeRequest = {};
			    changeRequest.crs = [];
				angular.forEach(selectedRows, function(row) {
					this.push({id: row.id , action : action.action});
				  },changeRequest.crs);
			  keywordsService.changhRequestAction(changeRequest,
					  function() {
				  scope.gridApi.clearAllSelected();
				  cleanDataGrid();
				  loadAllCampaigns();
				  scope.gridApi.grid.columns[4].filters[0].refresh = true;
				  $log.log('succeeded');
				  deferred.resolve();
			  },function(error) {
				  deferred.reject(error);
				  $log.log(error);
			  });
			  return deferred.promise;
		  };
		  
		  var executeAction = function($event ,action){
			  var dialogData = {
					  okFunction : actionOnGrig,
					  params : action,
					  title : action.label
			  };
			  ccDialog.customConfirm(dialogData,$event);
		  };

		  scope.actions = [
		                    {data: campaignsAction[0], executeAction : executeAction, disabled: isActionDisable},
		                    {data: campaignsAction[1], executeAction : executeAction, disabled: isActionDisable},
		                    {data: campaignsAction[2], executeAction : executeAction, disabled: isActionDisable},
		                    {data: campaignsAction[3], executeAction : executeAction, disabled: isActionDisable},
		                    {data: campaignsAction[4], executeAction : executeAction, display: isActionDisable}
		                   ]	  
			  ;
		  scope.generalActions = [
		                   {data: campaignsAction[5], executeAction : csvExport}		                   ]	  
		  ;
		  
		  loadAllCampaigns();
    });
