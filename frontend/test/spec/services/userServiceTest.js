'use strict';

describe('Service: UserService', function () {

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
        }},
        cookie, userService;

    beforeEach(module('mServices'));

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

    beforeEach(function () {
        var One41UserMock = function () {
            var One41User = function() {
                this.profile = user.profile;
            };
            One41User.prototype.login = function (username, password) {
                username = null;
                password = null;
                this.profile = user.profile;
            };

            One41User.prototype.logout = function () {};

            One41User.prototype.getUserProfile = function () {return this.profile;};

            One41User.prototype.isUserLogged = function () {return true;};

            One41User.prototype.broadcastUserStatusChanged = function () {};

            return One41User;
        };

        module(function ($provide) {
            $provide.factory('One41User', One41UserMock);
        });
    });

    beforeEach(inject(function (UserService) {
        userService = UserService;
     }));

    it('one41User should not be undefined', function () {

        expect(userService.getUser()).toNotBe(undefined);
    });

    it('one41User profile should not be undefined', function () {

        expect(userService.getUser().profile).toEqual(user.profile);
    });
});