'use strict';

describe('Controller: One41UserTest', function () {

    var httpBackend, rootScope, cookie;

    beforeEach(module(function($provide) {
        var cookieStoreMock = function(){
            return {
                get: function(key){
                    key = null;
                    return cookie;
                },
                put: function(key, data){
                    key = null;
                    cookie = data;
                },
                remove: function(key){
                    key = null;
                    cookie = undefined;
                }
            };
        };

        $provide.service('$cookieStore', cookieStoreMock);
    }));

    beforeEach(module('mServices'));
    //beforeEach(module('ngCookies'));

    beforeEach(inject(function ($injector) {
        httpBackend = $injector.get('$httpBackend');
        rootScope = $injector.get('$rootScope');
        spyOn(rootScope, '$broadcast');
    }));

    afterEach(function () {
        httpBackend.verifyNoOutstandingExpectation();
        httpBackend.verifyNoOutstandingRequest();
    });


    /*beforeEach(inject(function () {
        one41User = new One41User();

    }));*/

    it('one41User should not be undefined', inject(function (One41User) {
        var one41User = new One41User();

        expect(one41User).toNotBe(undefined);
    }));

    it('one41User profile should not be undefined', inject(function (One41User) {
        cookie = {'username': 'johndoe', 'password': 'secret'};

        var one41User = new One41User();

        expect(one41User.profile).toBe(cookie);
    }));

    it('login success',  inject(function(One41User) {
        var one41User = new One41User(),
            username = 'johndoe',
            password = 'secret',
            userProfile = {'username': username, 'password': password};

        httpBackend.when('POST', '/rest/user/authenticate').respond(200, {'user': userProfile});

        one41User.login(username, password);
        httpBackend.flush();

        expect(one41User.profile).toEqual(userProfile);
        expect(rootScope.$broadcast).toHaveBeenCalledWith('UserStatusChanged');
    }));

    it('login error AUTHENTICATE_INVALID_CREDENTIALS',  inject(function(One41User) {
        var one41User = new One41User(),
            username = 'johndoe',
            password = 'secret';

        httpBackend.when('POST', '/rest/user/authenticate').respond(200, {'error': {'errortype': 'AUTHENTICATE_INVALID_CREDENTIALS'}});

        one41User.login(username, password);
        httpBackend.flush();

        expect(one41User.profile).toBe(undefined);
    }));

    it('login error 500',  inject(function(One41User) {
        var one41User = new One41User(),
            username = 'johndoe',
            password = 'secret';

        httpBackend.when('POST', '/rest/user/authenticate').respond(500, 'Internal Server Error');

        one41User.login(username, password);
        httpBackend.flush();

        expect(one41User.profile).toBe(undefined);
    }));

    it('logout',  inject(function(One41User) {
        cookie = {'username': 'johndoe', 'password': 'secret'};

        var one41User = new One41User();

        expect(one41User.profile).toBe(cookie);

        one41User.logout();

        expect(one41User.profile).toBe(undefined);
        expect(cookie).toBe(undefined);
    }));

    it('get user profile',  inject(function(One41User) {
        cookie = {'username': 'johndoe', 'password': 'secret'};

        var one41User = new One41User();

        expect(one41User.getUserProfile()).toBe(one41User.profile);
    }));
});