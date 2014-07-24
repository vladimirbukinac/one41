'use strict';

describe('Controller: PostsCtrl', function () {

    // load the controller's module
    beforeEach(module('ngCookies'));
    beforeEach(module('feProperties'));
    beforeEach(module('mPosts'));

    var PostsCtrl, scope, log, interval;

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope, $log, $interval, UserService, Posts, feDateService, FrontendProperties) {
        scope = $rootScope.$new();
        log = $log;
        interval = $interval;
        PostsCtrl = $controller('PostsCtrl', {
            $rootScope: $rootScope,
            $scope: scope,
            $log: log,
            $interval: interval,
            UserService: UserService,
            Posts: Posts,
            feDateService: feDateService,
            FrontendProperties: FrontendProperties
        });
    }));

    it('should attach name', function () {
        expect(scope.showFeedback).toBe(false);
    });
});
