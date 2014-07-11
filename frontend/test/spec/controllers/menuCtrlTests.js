'use strict';

describe('Controller: DateTimeCtrl', function () {

  // load the controller's module
  beforeEach(module('mMenu'));
  beforeEach(module('ui.bootstrap'));
  beforeEach(module('one41feApp'));


  var DateTimeCtrl,
    scope, interval, service;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, $interval, feDateService) {
    //console.log('*** IN INJECT!!***: ', feDateService);
    scope = $rootScope.$new();
    interval = $interval;
    service = feDateService;
    DateTimeCtrl = $controller('DateTimeCtrl', {
      $scope: scope,
      $interval: interval,
      feDateService: service
    });
  }));

  it('should attach datetime', function () {
    expect(scope.datetime).toNotBe(null);
  });
});
