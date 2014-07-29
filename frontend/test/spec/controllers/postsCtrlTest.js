'use strict';

describe('Controller: PostsCtrl', function () {

    var PostsCtrl, scope, log, interval, listOfPosts, q, rootScope, deferred, promise, data, status;

    // load the controller's module
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

                    scope.posts.listOfPosts = data.messages;

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

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($rootScope, $q) {
        q = $q;
        rootScope = $rootScope;
        deferred = q.defer();
        promise = deferred.promise;
    }));

    beforeEach(inject(function ($controller, $log, $interval, UserServiceMock, PostsFactoryMock, feDateServiceMock, FrontendProperties, listOfPostsMock) {
        scope = rootScope.$new();
        log = $log;
        interval = $interval;
        PostsCtrl = $controller('PostsCtrl', {
            $rootScope: rootScope,
            $scope: scope,
            $log: log,
            $interval: interval,
            UserService: UserServiceMock,
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
    });

    it('deletePost error:', function () {
        scope.posts.listOfPosts = listOfPosts;
        var list = scope.posts.listOfPosts;
        status = 500;

        scope.deletePost(scope.posts.listOfPosts, list, 0);
        deferred.reject(status);
        rootScope.$apply();
        expect(scope.posts.listOfPosts.length).toBe(2);
    });

    it('getPosts success:', function () {
        status = 200;
        data = {messages: listOfPosts};

        scope.getPosts();
        deferred.resolve(data, status);
        rootScope.$apply();
        expect(scope.posts.listOfPosts.length).toBe(2);
    });

    it('getPosts success with error type TOKEN_EXPIRED:', function () {
        status = 200;
        data = {error: {errortype: 'TOKEN_EXPIRED'}};

        scope.getPosts();
        deferred.resolve(data, status);
        rootScope.$apply();
        expect(scope.posts.listOfPosts.length).toBe(0);
    });

    it('getPosts success with 500 Internal Server Error:', function () {
        status = 500;

        scope.getPosts();
        deferred.reject(status);
        rootScope.$apply();
        expect(scope.posts.listOfPosts.length).toBe(0);
    });
});
