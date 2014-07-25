'use strict';

describe('Controller: NewPostCtrl', function () {

    // load the controller's module
    beforeEach(module('ngCookies'));
    beforeEach(module('feProperties'));
    //beforeEach(module('ui.bootstrap'));  // needed for $modal
    beforeEach(module('mNewPost'));
    //beforeEach(module('one41feApp'));

    var deferred, promise, rootScope, q, ModalMock;



    beforeEach(function () {

        ModalMock = jasmine.createSpyObj('ModalMock', ['close', 'dismiss']);

        module(function ($provide) {
            $provide.value('ModalMock', ModalMock);
        });

        var NewPostModelMock = jasmine.createSpyObj('NewPostModelMock', ['getUser', 'postMessage']);

        NewPostModelMock.postMessage = function(){
            return promise;
        }
        module(function ($provide) {
            $provide.service('NewPostServiceMock', function () {

                return {
                    getPost: function() {
                        return NewPostModelMock;
                    }

                }

            });
        });

        var UserServiceMock = jasmine.createSpyObj('UserServiceMock', ['getUser']);
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
                    return (user, 200);
                },
                logout: function () {
                }
            };
        };

        module(function ($provide) {
            $provide.value('UserServiceMock', UserServiceMock);
        });
    });

    var PostsCtrl, scope, log, interval;

    var NewPostModalInsCtrl;
    // Initialize the controller and a mock scope

    beforeEach(inject(function ( $q, $controller, $rootScope, $log, $interval, UserServiceMock, Posts, FrontendProperties, NewPostServiceMock, ModalMock) {
        scope = $rootScope.$new();
        log = $log;
        q = $q;
        rootScope = $rootScope;
        deferred = q.defer();
        promise = deferred.promise;

        //'$rootScope', '$scope', 'UserService', '$modalInstance', '$log', 'newPostService'
        NewPostModalInsCtrl = $controller('NewPostModalInstanceCtrl', {
            '$rootScope': $rootScope, '$scope': scope, 'UserService': UserServiceMock, '$modalInstance': ModalMock , '$log': log, 'newPostService': NewPostServiceMock
        });
    }));

    it('post test:', function () {
        scope.post();
        deferred.resolve();
        rootScope.$apply();
        expect(ModalMock.close).toHaveBeenCalled();
    });

    it('cancel test:', function () {
        scope.cancel();
        deferred.resolve();
        rootScope.$apply();
        expect(ModalMock.dismiss).toHaveBeenCalled();
    });

    it('onFileSelect test:', function () {
        scope.onFileSelect({});
        deferred.resolve();
        rootScope.$apply();
        expect(scope.message.images).toBeDefined();
    });

});
