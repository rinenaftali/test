'use strict';
angular.module('ui')
.constant('baseUrl', '/ui/')
.factory('ccError' , function($translate){
	return {
		errorMessage : function (error){
			var code = error.code || error.status,
			content = $translate.instant('COMMON.ERROR.CONTENT.' + code);
			return content;
		} 
	};
	
})
.factory('ccDialog', function($mdDialog, $translate, ccError){
	function getConfiremDetails(event,content){
		var confirm = $mdDialog.confirm()
		.parent(angular.element(document.body))
		.title($translate.instant('COMMON.CONFIRM.TITLE'))
		.content(content || $translate.instant('COMMON.CONFIRM.CONTENT'))
		.ariaLabel($translate.instant('COMMON.CONFIRM.ARIA_TITLE'))
		.ok($translate.instant('COMMON.CONFIRM.OK'))
		.cancel($translate.instant('COMMON.CONFIRM.CANCEL'))
		.targetEvent(event);
		return confirm; 
	}
	
	return {
		error : function(error){
			$mdDialog.show(
					  $mdDialog.alert()
					  .parent(angular.element(document.body))
					  .title($translate.instant('COMMON.ERROR.TITLE'))
					  .content(ccError.errorMessage(error))
					  .ariaLabel($translate.instant('COMMON.ERROR.ARIA_TITLE'))
					  .ok($translate.instant('COMMON.ERROR.OK')));
		},
		confirm : function(content ,event, approveFun , rejectFun){
			$mdDialog.show(getConfiremDetails(event,content)).then(approveFun,rejectFun);
		},
		customConfirm : function(data ,event, approveFun , rejectFun){
			$mdDialog.show({
			controller: 'dialogCtrl as dialog',
			templateUrl: 'components/dialog/dialog.html',
			locals: {data : data}, 
			parent: angular.element(document.body),
			targetEvent: event}).then(approveFun,rejectFun);
		},
		selectDialog : function(data ,event, approveFun , rejectFun){
			$mdDialog.show({
			controller: 'dialogCtrl as dialog',
			templateUrl: 'components/dialog/selectDialog.html',
			locals: {data : data}, 
			parent: angular.element(document.body),
			targetEvent: event}).then(approveFun,rejectFun);
		}
	};
})
;