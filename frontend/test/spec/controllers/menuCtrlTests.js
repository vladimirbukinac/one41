'use strict';

describe('Controller: DateTimeCtrl', function () {

  // load the controller's module
  beforeEach(module('mMenu'));
  //beforeEach(module('ui.bootstrap'));
  //beforeEach(module('mServices'));


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

  it('datetime should not be null', function () {
    console.log(scope.datetime);
    expect(scope.datetime).toNotBe(null);
  });
});
