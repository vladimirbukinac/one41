'use strict';

angular.module('mServices')
    .factory('One41User', ['$rootScope', '$cookieStore', '$q', '$http', function ($rootScope, $cookieStore, $q, $http) {

        var One41User = function () {
            this.profile = $cookieStore.get('one41CookieKey');
        };

        One41User.prototype.login = function (username, password) {
            var deferred = $q.defer();
            var data = {'authentication': {'username': username, 'password': password}};

            var self = this;

            $http.post('/rest/user/authenticate', data)
                .success(function (data, status) {
                    self.profile = data.user;
                    $cookieStore.put('one41CookieKey', data.user);
                    self.broadcastUserStatusChanged();
                    deferred.resolve(status);
                })
                .error(function (status) {
                    deferred.reject(status);
                });

            return deferred.promise;
        };

        One41User.prototype.logout = function () {
            this.profile = undefined;
            $cookieStore.remove('one41CookieKey');
            this.broadcastUserStatusChanged();
        };

        One41User.prototype.getUserProfile = function () {
            return this.profile;
        };

        One41User.prototype.isUserLogged = function () {
            if (angular.equals(this.profile, undefined)) {
                return false;
            } else {
                return true;
            }
        };

        One41User.prototype.broadcastUserStatusChanged = function () {
            $rootScope.$broadcast('UserStatusChanged');
        };

        return One41User;
    }]);