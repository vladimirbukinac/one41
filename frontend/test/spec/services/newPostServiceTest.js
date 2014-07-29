'use strict';

describe('Service: NewPostModel', function () {


    // load the controller's module
    beforeEach(module('mNewPost'));
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
        module(function ($provide) {
            $provide.value('UserService', UserServiceMock);
        });
    });

    var $httpBackend;

    beforeEach(inject(function($injector) {
        // Set up the mock http service responses
        $httpBackend = $injector.get('$httpBackend');
        // backend definition common for all tests
        $httpBackend.when('POST', '/rest/message/create').respond({'message':{'id':114,'userId':1,'text':'newPost... ','creationDate':1406634856868,'images':[]}});

    }));


    afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

    var newPost;

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope, $log, UserServiceMock, NewPostModel  ) {

        newPost = new NewPostModel();

    }));

    it('showFeedback test:', function () {
        expect(newPost.text).toBe('newPost... ');
    });

    it('should post message', function() {
        $httpBackend.expectPOST('/rest/message/create');
        newPost.postMessage();
        expect(newPost.text).toBe('newPost... ');
        expect(newPost.images.length).toEqual(0);
        $httpBackend.flush();
    });

});

