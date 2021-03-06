'use strict';

describe('Controller: PostsCtrl', function () {

    var PostsCtrl, scope, log, interval, listOfPosts, q, rootScope, deferred, promise, data, status, userService;

    //beforeEach(module('ngCookies'));
    beforeEach(module('feProperties'));
    beforeEach(module('mPosts'));
    beforeEach(function () {
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
                    rootScope.$broadcast('UserStatusChanged');
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

    beforeEach(function () {
        var feDateServiceMock = jasmine.createSpyObj('feDateServiceMock', ['getCurrentDateTimeInFormatDMYHMS', 'getCurrentTimeInFormatHMS']);

        feDateServiceMock.getCurrentDateTimeInFormatDMYHMS.andCallFake(function () {
            return '18.07.2014 14:54:32';
        });

        feDateServiceMock.getCurrentTimeInFormatHMS.andCallFake(function () {
            return '18.07.2014';
        });

        module(function ($provide) {
            $provide.value('feDateServiceMock', feDateServiceMock);
        });
    });

    beforeEach(function () {
        var listOfPostsMock = [
            {
                message: {
                    id: 1,
                    userId: 1,
                    creationDate: '23.07.2014 18:00:00',
                    images: [],
                    text: 'First post'
                }
            },
            {
                message: {
                    id: 2,
                    userId: 2,
                    creationDate: '16.07.2014 17:00:00',
                    images: [],
                    text: 'Second post'
                }
            }
        ];

        module(function ($provide) {
            $provide.value('listOfPostsMock', listOfPostsMock);
        });
    });

    beforeEach(function () {
        var PostsFactoryMock = jasmine.createSpyObj('PostsFactoryMock', ['create']);

        PostsFactoryMock.create = function () {
            return {
                listOfPosts: [],
                getPosts: function (token) {
                    token = null;

                    if (angular.equals(data.error, undefined)) {
                        scope.posts.listOfPosts = data.messages;
                    } else {
                        scope.posts.listOfPosts = [];
                    }

                    return promise;
                },
                deletePost: function (token, id) {
                    token = null;
                    id = null;

                    return promise;
                },
                populateImages: function (token, post) {
                    token = null;
                    post = null;
                }
            };
        };

        module(function ($provide) {
            $provide.value('PostsFactoryMock', PostsFactoryMock);
        });
    });

    beforeEach(inject(function ($q, $rootScope, $controller, $log, $interval, UserServiceMock, PostsFactoryMock, feDateServiceMock, FrontendProperties, listOfPostsMock) {
        q = $q;
        rootScope = $rootScope;
        deferred = q.defer();
        promise = deferred.promise;
        scope = rootScope.$new();
        log = $log;
        interval = $interval;
        spyOn(scope, '$on').andCallThrough();
        userService = UserServiceMock;

        PostsCtrl = $controller('PostsCtrl', {
            $rootScope: rootScope,
            $scope: scope,
            $log: log,
            $interval: interval,
            UserService: userService,
            PostsFactory: PostsFactoryMock,
            feDateService: feDateServiceMock,
            FrontendProperties: FrontendProperties
        });
        listOfPosts = listOfPostsMock;
    }));

    it('showFeedback test:', function () {
        expect(scope.showFeedback).toBe(false);
    });

    it('isUserLogged test:', function () {
        expect(scope.isUserLogged()).toBe(true);
    });

    it('isUsersPost test I:', function () {
        scope.posts.listOfPosts = listOfPosts;

        expect(scope.isUsersPost(scope.posts.listOfPosts[0].message)).toBe(true);
    });

    it('isUsersPost test II:', function () {
        scope.posts.listOfPosts = listOfPosts;

        expect(scope.isUsersPost(scope.posts.listOfPosts[1].message)).toBe(false);
    });

    it('deletePost success:', function () {
        scope.posts.listOfPosts = listOfPosts;
        var list = scope.posts.listOfPosts;

        scope.deletePost(scope.posts.listOfPosts, list, 0);
        deferred.resolve();
        rootScope.$apply();

        expect(scope.posts.listOfPosts.length).toBe(1);
        expect(scope.posts.listOfPosts[0].message.id).toBe(2);
        expect(scope.status).toBe(undefined);
        expect(scope.showFeedback).toBe(false);
        expect(scope.alertType).toBe(undefined);
    });

    it('deletePost error, error status 500:', function () {
        scope.posts.listOfPosts = listOfPosts;
        var list = scope.posts.listOfPosts;
        status = 500;

        scope.deletePost(scope.posts.listOfPosts, list, 0);
        deferred.reject(status);
        rootScope.$apply();

        expect(scope.posts.listOfPosts.length).toBe(2);
        expect(scope.status).toBe(500);
        expect(scope.showFeedback).toBe(true);
        expect(scope.alertType).toBe('error');
    });

    it('getPosts success:', function () {
        status = 200;
        data = {messages: listOfPosts};

        scope.getPosts();
        deferred.resolve(data, status);
        rootScope.$apply();

        expect(scope.posts.listOfPosts.length).toBe(2);
        expect(scope.status).toBe(undefined);
        expect(scope.showFeedback).toBe(false);
        expect(scope.alertType).toBe(undefined);
    });

    it('getPosts error, error type TOKEN_EXPIRED:', function () {
        status = 200;
        data = {error: {errortype: 'TOKEN_EXPIRED'}};

        scope.getPosts();
        deferred.resolve(data, status);
        rootScope.$apply();

        expect(scope.posts.listOfPosts.length).toBe(0);
        expect(scope.status).toBe('Token is expired!');
        expect(scope.showFeedback).toBe(true);
        expect(scope.alertType).toBe('error');
    });

    it('getPosts error, error type TOKEN_INVALID:', function () {
        status = 200;
        data = {error: {errortype: 'TOKEN_INVALID'}};

        scope.getPosts();
        deferred.resolve(data, status);
        rootScope.$apply();

        expect(scope.posts.listOfPosts.length).toBe(0);
        expect(scope.status).toBe('Token is invalid!');
        expect(scope.showFeedback).toBe(true);
        expect(scope.alertType).toBe('error');
    });

    it('getPosts error, error type UNKNOWN_ERROR:', function () {
        status = 200;
        data = {error: {errortype: 'UNKNOWN_ERROR'}};

        scope.getPosts();
        deferred.resolve(data, status);
        rootScope.$apply();

        expect(scope.posts.listOfPosts.length).toBe(0);
        expect(scope.status).toBe('Unknown error!');
        expect(scope.showFeedback).toBe(true);
        expect(scope.alertType).toBe('error');
    });

    it('getPosts error, error status 500 Internal Server Error:', function () {
        status = 500;

        scope.getPosts();
        deferred.reject(status);
        rootScope.$apply();

        expect(scope.posts.listOfPosts.length).toBe(0);
        expect(scope.status).toBe(500);
        expect(scope.showFeedback).toBe(true);
        expect(scope.alertType).toBe('error');
    });

    it('$on UserStatusChanged event:', function(){
        userService.getUser().broadcastUserStatusChanged();

        expect(scope.$on).toHaveBeenCalledWith('UserStatusChanged', jasmine.any(Function));
    });
});
