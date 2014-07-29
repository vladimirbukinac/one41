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

        NewPostModelMock.text = 'test';
        NewPostModelMock.images = [];
        NewPostModelMock.postMessage = function(){
            return promise;
        };
        module(function ($provide) {
            $provide.service('NewPostServiceMock', function () {

                return {
                    getPost: function() {
                        return NewPostModelMock;
                    }

                };

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

    var eventListener;

    beforeEach(function(){
        eventListener = jasmine.createSpy();
        spyOn(window, 'FileReader').andReturn({
            addEventListener: eventListener,
            onload: function () {},
            readAsDataURL: function (){
                this.onload();
            },
            result: 'base64,file contents'
        });
    });

    var scope, log;

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
        deferred.resolve({'message':{'id':114,'userId':1,'text':'newPost... ','creationDate':1406634856868,'images':[]}});
        rootScope.$apply();
        expect(ModalMock.close).toHaveBeenCalled();
    });

    it('post resolve error test:', function () {
        scope.post();
        deferred.resolve({'error': 'test'});
        rootScope.$apply();
        expect(scope.alertType).toEqual('error');
    });

    it('post reject error test:', function () {
        scope.post();
        deferred.reject({'error': 'test'});
        rootScope.$apply();
        expect(scope.alertType).toEqual('error');
    });

    it('cancel test:', function () {
        scope.cancel();
        deferred.resolve();
        rootScope.$apply();
        expect(ModalMock.dismiss).toHaveBeenCalled();
    });

    it('onFileSelect test:', function () {
        scope.onFileSelect([{name: 'file name'}]);
        expect(scope.message.images).toBeDefined();
        expect(scope.message.images.length).toEqual(1);
        expect(scope.message.images[0].image.image).toEqual('file contents');
    });

});
