'use strict';

describe('Controller: PostsCtrl', function () {

    var PostsCtrl, scope, log, interval, listOfPosts;

    // load the controller's module
    beforeEach(module('ngCookies'));
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
                    text: 'Prvi post'
                }
            },
            {
                message: {
                    id: 2,
                    userId: 2,
                    creationDate: '16.07.2014 17:00:00',
                    images: [],
                    text: 'Drugi post'
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

                    return {
                        then: function () {
                        }
                    };
                },
                deletePost: function (token, id) {
                    token = null;
                    id = null;

                    return {
                        then: function () {
                        }
                    };
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
    beforeEach(inject(function ($controller, $rootScope, $log, $interval, UserServiceMock, PostsFactoryMock, feDateServiceMock, FrontendProperties, listOfPostsMock) {
        scope = $rootScope.$new();
        log = $log;
        interval = $interval;
        PostsCtrl = $controller('PostsCtrl', {
            $rootScope: $rootScope,
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

    it('deletePost success:', inject(function ($q, $rootScope) {
        var deferred = $q.defer();
        var promise = deferred.promise;
        scope.posts.listOfPosts = listOfPosts;
        var list = scope.posts.listOfPosts;

        spyOn(scope.posts, 'deletePost').andCallFake(function (token, id) {
            token = null;
            id = null;

            return promise;
        });

        scope.deletePost(scope.posts.listOfPosts, list, 0);
        deferred.resolve();
        $rootScope.$apply();
        expect(scope.posts.listOfPosts.length).toBe(1);
        expect(scope.posts.listOfPosts[0].message.id).toBe(2);

    }));

    it('getPosts success:', inject(function ($q, $rootScope) {
        var deferred = $q.defer();
        var promise = deferred.promise;
        var status = 200;
        var data = {messages: listOfPosts};

        spyOn(scope.posts, 'getPosts').andCallFake(function () {
            scope.posts.listOfPosts = data.messages;

            return promise;
        });

        scope.getPosts();
        deferred.resolve(data, status);
        $rootScope.$apply();
        expect(scope.posts.listOfPosts.length).toBe(2);
    }));

});
