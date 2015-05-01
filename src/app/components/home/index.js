/**
 * Created by Christian on 4/30/2015.
 */
'use strict';

module.exports = angular.module('home', [])
    .config(['$stateProvider', function ($stateProvider) {
        // States/Routes
        $stateProvider
            .state('home', {
                abstract: true,
                template: require('./layout.html'),
                controller: 'HomeCtrl',
                role: 'public'
            })
            .state('home.index', {
                url: '',
                template: require('./home.html'),
                role: 'public'
            }).state('home.index.home', {
                'url': '/home'
            });
        console.log('test');
    }])
    .controller('HomeCtrl', ['$scope', '$state', '$window', '$filter',  function ($scope, $state, $window, $filter) {
    }]);
