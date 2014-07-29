'use strict';

describe('Controller: LoginCtrl', function () {

    var scope, LoginCtrl;

    beforeEach(module('mMenu'));

    //beforeEach(module('mServices'));

    beforeEach(function () {
        var UserServiceMock = jasmine.createSpyObj('UserService', ['getUser']);
        var user = {
            profile: {
                id: 1,
                username: 'johndoe',
                password: 'secret',
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@one41.com',
                pictureUrl: 'http://one41.com/johndoe/johndoe.jpg',
                token: 'd8771dde-da27-4527-bfbf-a2716d4225b9'
            }};

        UserServiceMock.getUser = function () {
            return {
                profile: user.profile,
                broadcastUserStatusChanged: function () {
                },
                getUserProfile: function () {
                    return user.profile;
                },
                isUserLogged: function () {
                    return true;
                },
                login: function (username, password) {
                    username = undefined;
                    password = undefined;
                },
                logout: function () {
                }
            };
        };

        module(function ($provide) {
            $provide.value('UserService', UserServiceMock);
        });
    });

    beforeEach(inject(function ($controller, $rootScope, $modal, $log, $timeout, UserService) {
        scope = $rootScope.$new();
        LoginCtrl = $controller('LoginCtrl', {
            $scope: scope,
            $modal: $modal,
            $log: $log,
            $timeout: $timeout,
            UserService: UserService
        });
    }));

    it('is user logged in', function() {

        expect(scope.isUserLogged()).toBe(true);
    });
});
