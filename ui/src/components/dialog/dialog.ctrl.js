'use strict';
angular.module('ui')
.controller('dialogCtrl', function($mdDialog, $translate, $q, data, ccError) {
	var scope = this;
	scope.data = data;
	scope.title = data.title || 'COMMON.CONFIRM.TITLE';
	scope.content = data.content || 'COMMON.CONFIRM.CONTENT';
	scope.ariaLabel = data.ariaLabel || 'COMMON.CONFIRM.ARIA_TITLE';
	scope.ok = data.ok || 'COMMON.CONFIRM.OK';
	scope.cancel = data.cancel || 'COMMON.CONFIRM.CANCEL';
	scope.okValue = data.params;
	scope.hide = function() {
		if (data.okFunction){
			scope.loading = true;
			var okValue = scope.okValue;
			delete scope.okValue;
			$q.when(data.okFunction(okValue)).then(function(){
				scope.loading = false;
				$mdDialog.hide();
			},function(error){
				scope.error = ccError.errorMessage(error);
				scope.loading = false;
			});
		}else{
			$mdDialog.hide();	
		}
	};
	scope.abort = function() {
		$mdDialog.cancel();
	};
});

