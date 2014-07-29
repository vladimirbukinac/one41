'use strict';

describe('Domain object: Posts', function () {

    var httpBackend;
    var imagesMessage1 = [
        {
            image: {
                id: 1,
                name: 'img1.png',
                image: 'iVBORw0KGgoAAAANSUhEUgAA...n8/J/CkAAAAAElFTkSuQmC'
            }
        }
    ];
    var message1 = {
            message: {
                id: 1,
                userId: 1,
                creationDate: '1405434280',
                images: [],
                text: 'First post'
            }
        },
        message2 = {
            message: {
                id: 2,
                userId: 2,
                creationDate: '1406564280',
                images: [],
                text: 'Second post'
            }
        },
        message1DateFormatted = {
            message: {
                id: 1,
                userId: 1,
                creationDate: '18.07.2014 14:54:32',
                images: [],
                text: 'First post'
            }
        },
        message2DateFormatted = {
            message: {
                id: 2,
                userId: 2,
                creationDate: '18.07.2014 14:54:32',
                images: [],
                text: 'Second post'
            }
        },
        message1DateFormattedWithImages = {
            message: {
                id: 1,
                userId: 1,
                creationDate: '18.07.2014 14:54:32',
                images: imagesMessage1,
                text: 'First post'
            }
        };

    var listOfPosts = [message1, message2],
        listOfPostsAndDateFormatted = [message1DateFormatted, message2DateFormatted],
        listOfPostsAndDateFormattedWithImages = [message1DateFormattedWithImages, message2DateFormatted];

    beforeEach(module('mServices'));
    beforeEach(module('feProperties'));

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
                    return (user, 200);
                },
                logout: function () {
                }
            };
        };

        module(function ($provide) {
            $provide.value('UserService', UserServiceMock);
        });
    });

    beforeEach(function () {
        var feDateServiceMock = jasmine.createSpyObj('feDateService', ['getCurrentDateTimeInFormatDMYHMS', 'getCurrentTimeInFormatHMS']);

        feDateServiceMock.getCurrentDateTimeInFormatDMYHMS.andCallFake(function () {
            return '18.07.2014 14:54:32';
        });

        feDateServiceMock.getCurrentTimeInFormatHMS.andCallFake(function () {
            return '18.07.2014';
        });

        module(function ($provide) {
            $provide.value('feDateService', feDateServiceMock);
        });
    });


    beforeEach(inject(function ($injector) {
        httpBackend = $injector.get('$httpBackend');
    }));

    afterEach(function () {
        httpBackend.verifyNoOutstandingExpectation();
        httpBackend.verifyNoOutstandingRequest();
    });


    /*beforeEach(inject(function (UserService, feDateService) {


     }));*/


    it('posts should not be undefined', inject(function (UserService, feDateService, Posts) {
        var posts = new Posts();

        expect(posts).toNotBe(undefined);
    }));

    it('Posts factory creates posts, posts should not be undefined', inject(function (PostsFactory, UserService, feDateService, Posts) {
        var posts = PostsFactory.create(Posts);

        expect(posts).toNotBe(undefined);
        expect(posts.listOfPosts).toEqual([]);
    }));

    it('get posts without images, success', inject(function (PostsFactory, UserService, feDateService, Posts) {
        var posts = PostsFactory.create(Posts);

        httpBackend.when('POST', '/rest/message/latest', {
            token: {
                token: UserService.getUser().getUserProfile().token}
        }).respond(200, {messages: listOfPosts});

        httpBackend.when('POST', '/rest/message/get').respond(200, {message: {images: []}});

        posts.getPosts(UserService.getUser().getUserProfile().token);
        httpBackend.flush();

        expect(posts.listOfPosts).toEqual(listOfPostsAndDateFormatted);
    }));

    it('get posts with images, success', inject(function (PostsFactory, UserService, feDateService, Posts) {
        var posts = PostsFactory.create(Posts);

        httpBackend.when('POST', '/rest/message/latest', {
            token: {
                token: UserService.getUser().getUserProfile().token}
        }).respond(200, {messages: listOfPosts});

        httpBackend.when('POST', '/rest/message/get', {
            message: {
                id: message1.message.id,
                token: UserService.getUser().getUserProfile().token}
        }).respond(200, {message: {images: imagesMessage1}});

        httpBackend.when('POST', '/rest/message/get', {
            message: {
                id: message2.message.id,
                token: UserService.getUser().getUserProfile().token}
        }).respond(200, {message: {images: []}});

        posts.getPosts(UserService.getUser().getUserProfile().token);
        httpBackend.flush();


        expect(posts.listOfPosts).toEqual(listOfPostsAndDateFormattedWithImages);
    }));

    it('get posts, error TOKEN_EXPIRED', inject(function (PostsFactory, UserService, feDateService, Posts) {
        var posts = PostsFactory.create(Posts);

        httpBackend.when('POST', '/rest/message/latest', {
            token: {
                token: UserService.getUser().getUserProfile().token}
        }).respond(200, {error: {errortype: 'TOKEN_EXPIRED'}});

        posts.getPosts(UserService.getUser().getUserProfile().token);
        httpBackend.flush();

        expect(posts.listOfPosts).toEqual([]);
    }));

    it('get posts, error 500', inject(function (PostsFactory, UserService, feDateService, Posts) {
        var posts = PostsFactory.create(Posts);

        httpBackend.when('POST', '/rest/message/latest', {
            token: {
                token: UserService.getUser().getUserProfile().token}
        }).respond(500, 'Internal Server Error');

        posts.getPosts(UserService.getUser().getUserProfile().token);
        httpBackend.flush();

        expect(posts.listOfPosts).toEqual([]);
    }));

    // this test doesn't do anything
    it('delete post, success', inject(function (PostsFactory, UserService, feDateService, Posts) {
        var posts = PostsFactory.create(Posts);

        posts.listOfPosts = listOfPostsAndDateFormattedWithImages;

        httpBackend.when('POST', '/rest/message/delete', {
            message: {
                id: message1.message.id,
                token: UserService.getUser().getUserProfile().token}
        }).respond(200);

        posts.deletePost(UserService.getUser().getUserProfile().token, message1.message.id);
        httpBackend.flush();

        expect(posts.listOfPosts).toEqual(listOfPostsAndDateFormattedWithImages);
    }));

    // this test doesn't do anything
    it('delete post, error 500', inject(function (PostsFactory, UserService, feDateService, Posts) {
        var posts = PostsFactory.create(Posts);

        posts.listOfPosts = listOfPostsAndDateFormattedWithImages;

        httpBackend.when('POST', '/rest/message/delete', {
            message: {
                id: message1.message.id,
                token: UserService.getUser().getUserProfile().token}
        }).respond(500);

        posts.deletePost(UserService.getUser().getUserProfile().token, message1.message.id);
        httpBackend.flush();

        expect(posts.listOfPosts).toEqual(listOfPostsAndDateFormattedWithImages);
    }));

    it('populate images, success', inject(function (PostsFactory, UserService, feDateService, Posts) {
        var posts = PostsFactory.create(Posts);

        posts.listOfPosts = listOfPostsAndDateFormatted;

        httpBackend.when('POST', '/rest/message/get', {
            message: {
                id: message1.message.id,
                token: UserService.getUser().getUserProfile().token}
        }).respond(200, {message: {images: imagesMessage1}});

        posts.populateImages(UserService.getUser().getUserProfile().token, posts.listOfPosts[0].message);
        httpBackend.flush();

        expect(posts.listOfPosts).toEqual(listOfPostsAndDateFormattedWithImages);
    }));

    it('populate images, error', inject(function (PostsFactory, UserService, feDateService, Posts) {
        var posts = PostsFactory.create(Posts);

        posts.listOfPosts = listOfPostsAndDateFormatted;

        httpBackend.when('POST', '/rest/message/get', {
            message: {
                id: message1.message.id,
                token: UserService.getUser().getUserProfile().token}
        }).respond(500, {message: {images: imagesMessage1}});

        posts.populateImages(UserService.getUser().getUserProfile().token, posts.listOfPosts[0].message);
        httpBackend.flush();

        expect(posts.listOfPosts).toEqual(listOfPostsAndDateFormatted);
    }));

});