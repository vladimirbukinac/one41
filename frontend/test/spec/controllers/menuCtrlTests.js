'use strict';

describe('Controller: DateTimeCtrl', function () {

    // load the controller's module
    beforeEach(module('mMenu'));
    beforeEach(function () {
        var feDateServiceMock = jasmine.createSpyObj('feDateServiceMock', ['getCurrentDateTimeInFormatDMYHMS', 'getCurrentTimeInFormatHMS']);

        feDateServiceMock.getCurrentDateTimeInFormatDMYHMS.andCallFake(function () {
            return '18.07.2014 14:54:32';
        });

        feDateServiceMock.getCurrentTimeInFormatHMS.andCallFake(function () {
            return '18.07.2014';
        });

        module(function ($provide) {
            $provide.value('feDateServiceMock', feDateServiceMock);
        });
    });

    var DateTimeCtrl, scope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope, $interval, feDateServiceMock) {
        scope = $rootScope.$new();
        DateTimeCtrl = $controller('DateTimeCtrl', {
            $scope: scope,
            $interval: $interval,
            feDateService: feDateServiceMock
        });
    }));

    it('datetime should not be null', function () {
        expect(scope.datetime).toBe('18.07.2014');
    });
});
