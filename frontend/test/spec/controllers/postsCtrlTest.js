'use strict';

describe('Controller: PostsCtrl', function () {

  // load the controller's module
  beforeEach(module('mPosts'));

  var PostsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    PostsCtrl = $controller('PostsCtrl', {
      $scope: scope
    });
  }));

  it('should attach name', function () {
    expect(scope.name).toBe('2');
  });
});
