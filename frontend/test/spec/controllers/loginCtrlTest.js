'use strict';

describe('Controller: LoginCtrl', function () {

    var scope, LoginCtrl, ModalMock, userService, rootScope, log, userProfile;

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

    beforeEach(module('mMenu'));

    //beforeEach(module('mServices'));

    beforeEach(function () {
        var UserServiceMock = jasmine.createSpyObj('UserService', ['getUser']);

        UserServiceMock.getUser = function () {
            return {
                broadcastUserStatusChanged: function () {
                    rootScope.$broadcast('UserStatusChanged');
                },
                getUserProfile: function () {
                    return userProfile;
                },
                isUserLogged: function () {
                    return userProfile !== undefined;
                },
                login: function (username, password) {
                    username = undefined;
                    password = undefined;
                    userProfile = user.profile;
                },
                logout: function () {
                    userProfile = undefined;
                }
            };
        };

        module(function ($provide) {
            $provide.value('UserService', UserServiceMock);
        });
    });

    var dialog = {
        result: {
            then: function(confirmCallBack, cancelCallback) {
                this.confirmCallBack = confirmCallBack;
                this.cancelCallback = cancelCallback;
            }
        },
        close: function() {
            this.result.confirmCallBack();
        },
        dismiss: function() {
            this.result.cancelCallback();
        }
    };

    beforeEach(function () {
        ModalMock = jasmine.createSpyObj('ModalMock', ['open']);

        ModalMock.open = function () {
            return dialog;
        };

        module(function ($provide) {
            $provide.value('ModalMock', ModalMock);
        });
    });

    beforeEach(inject(function ($controller, $rootScope, ModalMock, $log, $timeout, UserService) {
        rootScope = $rootScope;
        scope = $rootScope.$new();
        log = $log;
        userService = UserService;
        spyOn(scope, '$on').andCallThrough();

        LoginCtrl = $controller('LoginCtrl', {
            $scope: scope,
            $modal: ModalMock,
            $log: log,
            $timeout: $timeout,
            UserService: userService
        });
    }));

    it('is user logged in:', function () {

        expect(scope.isUserLogged()).toBe(false);
    });

    it('logout user: ', function () {
        userProfile = user.profile;

        scope.logout();

        expect(scope.user).toBe(undefined);
    });

    it('login user, success:', function () {
        userProfile = user.profile;

        scope.login();
        dialog.close();

        expect(scope.user).toEqual(user.profile);
    });

    it('login user, dismiss:', function () {
        var output;

        spyOn(log, 'info').andCallFake(function(logOutput){
            output = logOutput;
        });

        scope.login();
        dialog.dismiss();

        expect(scope.user).toBe(undefined);
        expect(output.substr(0, 20)).toEqual('Modal dismissed at: ');
    });

    it('$on UserStatusChanged event:', function() {
        scope.user = undefined;

        userService.getUser().broadcastUserStatusChanged();

        expect(scope.user).toEqual(user.profile);
        expect(scope.$on).toHaveBeenCalledWith('UserStatusChanged', jasmine.any(Function));
    });
});
