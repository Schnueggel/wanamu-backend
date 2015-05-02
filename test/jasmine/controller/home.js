'use strict';

describe('HomeCtrl', function () {

    var controller,
        $scope;

    beforeEach(module('nautic'));
    beforeEach(module('home'));

    beforeEach(inject(function ($rootScope, $controller) {
        $scope = $rootScope.$new();
        controller = $controller('HomeCtrl as Home', {'$scope': $scope});
    }));

    describe('Controller Home', function () {
        it('Check Controller vars', function () {
            expect(controller.hund).toEqual('wauwau');
        });
    });
});
