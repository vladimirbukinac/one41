'use strict';

describe('Controller: MenuCtrl', function () {

  // load the controller's module
  beforeEach(module('mMenu'));
  beforeEach(function() {
      module('one41feApp');
  });

  var MenuCtrl,
    scope, interval, service;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, $interval, feDateService) {
    //console.log('*** IN INJECT!!***: ', feDateService);
    scope = $rootScope.$new();
    interval = $interval;
    service = feDateService;
    MenuCtrl = $controller('MenuCtrl', {
      $scope: scope,
      $interval: interval,
      feDateService: service
    });
  }));

  it('should attach datetime', function () {
    expect(scope.datetime).toNotBe(null);
  });
});
