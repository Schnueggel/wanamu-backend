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
                template: 'template.html',
                controller: 'HomeCtrl',
                role: 'public'
            });
    }])
    .controller('HomeCtrl', ['$scope', '$state', '$window', '$filter',  function ($scope, $state, $window, $filter) {}]);
