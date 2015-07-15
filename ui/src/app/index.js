'use strict';
angular.module('angularTranslateApp', ['pascalprecht.translate'])
.config(function($translateProvider) {
	$translateProvider.useStaticFilesLoader({
		'prefix': 'assets/i18n/main.',
		'suffix': '.json'
	});
//	$translateProvider.useLoader('$translatePartialLoader', {
//	urlTemplate: 'assets/i18n/{part}.{lang}.json'
//	});

	$translateProvider.preferredLanguage('en-us');
//	$translatePartialLoaderProvider.addPart('main');

	// Enable escaping of HTML
	$translateProvider.useSanitizeValueStrategy('escaped');

})
.run(function($rootScope){
	$rootScope.$on('$translateChangeSuccess', function () {
		$rootScope.translateChangeSuccess = true; 
	});
})
;

angular.module('ui', ['angularTranslateApp']); 
angular.module('uiApp', ['ngAnimate', 'ngCookies', 'ngTouch', 'ngSanitize', 'ngResource', 'ui.router', 'ngMaterial','ui.grid', 'ui.grid.selection','ui.grid.autoResize','ui.grid.resizeColumns', 'ui.grid.exporter', 'ui.select','isteven-multi-select', 'ui'])
.config(function ($stateProvider, $urlRouterProvider) {
	var HOME_PAGE = 'campaigns';
	var requireTranslations = function($translatePartialLoader, $rootScope, $q) {
		if($rootScope.translateChangeSuccess){
			return;
		}
		var deferred = $q.defer();
		$rootScope.$on('$translateChangeSuccess', function() {
			deferred.resolve();
		});

		return deferred.promise;
	};

	$stateProvider
	.state('approval', {
		url: '^/campaigns/approval/:campId',
		templateUrl: 'app/approval/approval.html',
		resolve:{
			requireTranslations: requireTranslations
		},
		controller: 'approvalCtrl as approval',
		access: {
			requireLogin: true 
		}
	})
	.state('campaigns', {
		url: '^/campaigns',
		templateUrl: 'app/campaigns/campaigns.html',
		resolve:{
			requireTranslations: requireTranslations
		},
		controller: 'campaignslCtrl as campaigns',
		access: {
			requireLogin: true 
		}
	})
	.state('login', {
		url: '^/login',
		templateUrl: 'app/login/login.html',
		resolve:{
			requireTranslations: requireTranslations
		},
		controller: 'loginCtrl'
	});
	
	$urlRouterProvider.otherwise( function($injector) {
        var $state = $injector.get('$state');
        $state.go(HOME_PAGE);
    });
})
.config(function(uiSelectConfig) {
  uiSelectConfig.theme = 'select2';
})
.config(function($mdThemingProvider) {
	$mdThemingProvider.definePalette('ccBlue', {
	    '50': '#f0fafa',
	    '100': '#d1f0f0',
	    '200': '#b3e6e6',
	    '300': '#99dddd',
	    '400': '#7fd4d4',
	    '500': '#66cccc',
	    '600': '#59b3b3',
	    '700': '#4d9999',
	    '800': '#408080',
	    '900': '#336666',
	    'A100': '#d1f0f0',
	    'A200': '#b3e6e6',
	    'A400': '#7fd4d4',
	    'A700': '#4d9999'
	});

	$mdThemingProvider.definePalette('ccGreen', {
	    '50': '#fafff5',
	    '100': '#f0ffe0',
	    '200': '#e6ffcc',
	    '300': '#ddffbb',
	    '400': '#d4ffaa',
	    '500': '#ccff99',
	    '600': '#b3df86',
	    '700': '#99bf73',
	    '800': '#809f60',
	    '900': '#66804d',
	    'A100': '#f0ffe0',
	    'A200': '#e6ffcc',
	    'A400': '#d4ffaa',
	    'A700': '#99bf73'
	});

//	$mdThemingProvider.theme('default')
//		.primaryPalette('ccGreen')
//		.accentPalette('ccBlue');

})
.run(function ($rootScope, $state, authenticationService) {
	$rootScope.$on('$stateChangeStart', function (event, toState, toParams) {
		if (toState.access && toState.access.requireLogin && !authenticationService.get()) {
			event.preventDefault();
			$rootScope.returnToState = toState.name;
			$rootScope.returnToStateParams = toParams;
			$state.go('login');
		}
	});

})
.directive('confirmOnExit', function($translate, $window) {
	return {
		restrict: 'EA',
		scope: {isDirty: '&', message: '@'},
		link: function($scope) {
			var isConfirm = false;
			$window.onbeforeunload = function(){
				if ($scope.isDirty()) {
					return $translate.instant($scope.message);
				}
			};
			$scope.$on('$stateChangeStart', function(event) {
                if (!isConfirm && $scope.isDirty()) {
                	isConfirm = true;
                    if(!confirm($translate.instant($scope.message))) {
                        event.preventDefault();
                        isConfirm = false;
                    }
                }
            });
			$scope.$on('$destroy', function() {
				$window.onbeforeunload = undefined;
			});


		}
	};
});





