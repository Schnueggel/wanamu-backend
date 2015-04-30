
/*global window*/
var ngModule = angular.module('nautic', [
    'ui.router',
    'ngAnimate',
    'ngTouch',
    'cfp.hotkeys',
    require('./home').name,
    'pascalprecht.translate'
]);

ngModule.config([
    '$provide',
    '$stateProvider',
    '$urlRouterProvider',
    '$translateProvider',
    '$httpProvider',
    '$logProvider',
    function ($provide, $stateProvider, $urlRouterProvider, $translateProvider, $httpProvider, $logProvider) {
        /*
         * $log provider enable disable on dev environment
         */
        $logProvider.debugEnabled(config.debug);

        // Fallback on unknown state/route
        $urlRouterProvider.otherwise('/home');

        /*
         * translate settings
         */
        $translateProvider.useStaticFilesLoader({
            prefix: 'l10n/locale-',
            suffix: '.json'
        });

        $translateProvider.determinePreferredLanguage(function () {
            var preferredLangKey = 'en';
            // array result
            if (angular.isArray(window.navigator.languages)) {
                preferredLangKey = window.navigator.languages[0].replace(/[^a-z]+/g, '');
            }

            // string result
            if (angular.isString(window.navigator.languages)) {
                preferredLangKey = window.navigator.languages.replace(/[^a-z]+/g, '');
            }

            return preferredLangKey;
        });

        $translateProvider.fallbackLanguage('en');

        /*
         * HTTP Interceptor
         */
        $httpProvider.interceptors.push('errorHttpInterceptor');

    }
])
    .run(['$rootScope',  '$state', '$log', '$window',
        function ($rootScope, $state, $log, $window) {
            /**
             * Default Params for other modules
             */
            $rootScope.config = {
                signinSuccessState: 'panel.view.home',
                API: $window.sessionStorage.API
            };

            $rootScope.$state = $state;

            /**
             * Add display object to rootScope. Yoso display size detection directive is connected.
             * Every controller and template can get current display size using $scope.display.size
             */
            $rootScope.display = {
                size: 'undefined'
            };

        }]);

module.exports = ngModule;