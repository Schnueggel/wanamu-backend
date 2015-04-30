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
            })
            .state('home.index', {
                url: '/',
                template: require('./home.html'),
                role: 'public'
            })
            .state('home.contact', {
                url: '/contact',
                template: require('./contact.html'),
                role: 'public'
            })
            .state('home.termsofuse', {
                url: '/termsofuse',
                template: require('./termsofuse.html'),
                role: 'public'
            })
            .state('home.about', {
                url: '/about',
                template: require('./about.html'),
                role: 'public'
            })
            .state('home.connectionerror', {
                url: '/connectionerror',
                template: require('./connectionerror.html'),
                role: 'public'
            })
            .state('home.accessdenied', {
                url: '/accessdenied',
                template: require('./accessdenied.html'),
                role: 'public'
            })
            .state('home.servererror', {
                url: '/servererror',
                template: require('./servererror.html'),
                role: 'public'
            });
        // END
    }])
    .controller('HomeCtrl', ['$scope', '$state', '$window', '$filter',  function ($scope, $state, $window, $filter) {}]);