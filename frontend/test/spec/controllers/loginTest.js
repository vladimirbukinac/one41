'use strict';

describe('Controller: LoginModalInstanceCtrl', function () {

    var scope, log, LoginModalInstanceCtrl, ModalMock;
    var deferred, promise, rootScope, q;
    var user = {
        user: {
            profile: {
                id: 1,
                username: 'johndoe',
                password: 'secret',
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@one41.com',
                pictureUrl: 'http://one41.com/johndoe/johndoe.jpg',
                token: 'd8771dde-da27-4527-bfbf-a2716d4225b9'
            }
        }
    };

    beforeEach(module('mLogin'));

    beforeEach(function () {
        ModalMock = jasmine.createSpyObj('ModalMock', ['close', 'dismiss']);

        ModalMock.close.andCallFake(function () {

        });

        ModalMock.dismiss.andCallFake(function (cancel) {
            cancel = null;
        });

        module(function ($provide) {
            $provide.value('ModalMock', ModalMock);
        });
    });

    beforeEach(function () {
        var UserServiceMock = jasmine.createSpyObj('UserServiceMock', ['getUser']);

        UserServiceMock.getUser = function () {
            return {
                profile: undefined,
                broadcastUserStatusChanged: function () {
                },
                getUserProfile: function () {
                    return this.profile;
                },
                isUserLogged: function () {
                    return true;
                },
                login: function (username, password) {
                    username = undefined;
                    password = undefined;
                    return deferred.promise;
                },
                logout: function () {
                }
            };
        };

        module(function ($provide) {
            $provide.value('UserServiceMock', UserServiceMock);
        });
    });

    beforeEach(inject(function ($q, $controller, $rootScope, ModalMock, $log, UserServiceMock) {
        scope = $rootScope.$new();
        log = $log;
        q = $q;
        rootScope = $rootScope;
        deferred = q.defer();
        promise = deferred.promise;

        LoginModalInstanceCtrl = $controller('LoginModalInstanceCtrl', {
            $rootScope: $rootScope,
            $scope: scope,
            $modalInstance: ModalMock,
            $log: log,
            UserService: UserServiceMock
        });
    }));

    it('cancel test:', function () {
        scope.cancel();
        deferred.resolve();
        rootScope.$apply();
        expect(ModalMock.close).not.toHaveBeenCalled();
        expect(ModalMock.dismiss).toHaveBeenCalled();
    });

    it('login test, success:', function () {
        var data = user;
        scope.user = {username: 'johdoe', password: 'secret'};
        scope.login();
        deferred.resolve(data);
        rootScope.$apply();
        expect(ModalMock.close).toHaveBeenCalled();
        expect(ModalMock.dismiss).not.toHaveBeenCalled();
        expect(scope.status).toBe(undefined);
        expect(scope.showFeedback).toBe(false);
        expect(scope.alertType).toBe(undefined);
    });

    it('login test, error AUTHENTICATE_INVALID_CREDENTIALS:', function () {
        var data = {error: {errortype: 'AUTHENTICATE_INVALID_CREDENTIALS'}};
        scope.user = {username: 'johdoe', password: 'secret'};

        scope.login();
        deferred.resolve(data);
        rootScope.$apply();

        expect(ModalMock.close).not.toHaveBeenCalled();
        expect(ModalMock.dismiss).not.toHaveBeenCalled();
        expect(scope.status).toBe('Invalid credentials!');
        expect(scope.showFeedback).toBe(true);
        expect(scope.alertType).toBe('error');
    });

    it('login test, error UNKNOWN_ERROR:', function () {
        var data = {error: {errortype: 'UNKNOWN_ERROR'}};
        scope.user = {username: 'johdoe', password: 'secret'};

        scope.login();
        deferred.resolve(data);
        rootScope.$apply();

        expect(ModalMock.close).not.toHaveBeenCalled();
        expect(ModalMock.dismiss).not.toHaveBeenCalled();
        expect(scope.status).toBe('Unknown error!');
        expect(scope.showFeedback).toBe(true);
        expect(scope.alertType).toBe('error');
    });

    it('login test, error 500:', function () {
        scope.user = {username: 'johdoe', password: 'secret'};

        scope.login();
        deferred.reject(500);
        rootScope.$apply();

        expect(ModalMock.close).not.toHaveBeenCalled();
        expect(ModalMock.dismiss).not.toHaveBeenCalled();
        expect(scope.status).toBe(500);
        expect(scope.showFeedback).toBe(true);
        expect(scope.alertType).toBe('error');
    });

    it('close alert:', function () {
        scope.showFeedback = true;

        scope.closeAlert();

        expect(scope.showFeedback).toBe(false);
    });
});
