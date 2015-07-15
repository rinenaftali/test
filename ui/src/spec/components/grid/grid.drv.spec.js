'use strict';
describe('Unit testing great quotes', function() {
	var element, scope;

	beforeEach(module('uiApp','gulpAngular'));

	beforeEach(inject(function($rootScope, $httpBackend){
		$httpBackend = $httpBackend;
		$httpBackend.when('GET', 'assets/i18n/main.en-us.json').respond({});
		scope = $rootScope.$new();
	}));

	beforeEach(inject(function(columnGrid){
		var campaignName = {name : 'camp', title : 'CAMPAIGNS.TITLE.CAMPAIGN_NAME', 'filterType' : 'input'};
		var accountName =  {name : 'account' , title : 'CAMPAIGNS.TITLE.ACCOUNT_NAME', 'filterType' : 'input'};
		var status = {
				'name' : 'status',
				'title' : 'CAMPAIGNS.TITLE.STATUS',
				'tooltip' : 'CAMPAIGNS.TITLE.STATUS',
				'filterType' : 'select', 
				'values' : { 
					'reviewed' : {
						'label' : 'CAMPAIGNS.MENU.REVIEWED', 	 
					},
					'pending' : {
						'label' : 'CAMPAIGNS.MENU.PENDING',
					},
					'committed' : {
						'label' : 'CAMPAIGNS.MENU.COMMITTED',
					},
					'deployed' : {
						'label' : 'CAMPAIGNS.MENU.DEPLOYED',
					},
					'cancelled' : {
						'label' : 'CAMPAIGNS.MENU.CANCELLED',
					}}
		};

		scope.gridApi = {};
		scope.gridOptions = columnGrid.getGridOptions([campaignName, accountName, status],true);
		scope.gridOptions.data = [{account:'a', campaign: 'aa' , status:'committed'},
		                          {account:'b', campaign: 'bb' , status:'deployed'},
		                          {account:'c', campaign: 'bb' , status:'cancelled'}];
	}));
	
	
	beforeEach(inject(function($compile){
		element = '<div cc-grid grid-options=gridOptions grid-api=gridApi></div>';
		element = $compile(element)(scope);
		scope.$digest();
	}));
	


	
	it('', (inject(function() {
		var isolateScope = element.isolateScope();
		// Rows
		expect(isolateScope.grid.gridApi.grid.rows.length).toBe(3);
		
		// Columns
		expect(isolateScope.grid.gridApi.grid.columns.length).toBe(4); // 3 column + selection column
		expect(isolateScope.grid.gridApi.grid.columns[1].name).toEqual('camp');
		expect(isolateScope.grid.gridApi.grid.columns[2].name).toEqual('account');
		expect(isolateScope.grid.gridApi.grid.columns[3].name).toEqual('status');
		
			
	})));
});