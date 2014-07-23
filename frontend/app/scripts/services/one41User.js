'use strict';

angular.module('mServices')
    .factory('One41User', ['$rootScope', '$cookieStore', '$q', '$http', function ($rootScope, $cookieStore, $q, $http) {
        var user = function () {
            this.profile = $cookieStore.get('one41CookieKey');
        };

        user.prototype.login = function (username, password) {
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

        user.prototype.logout = function () {
            this.profile = undefined;
            $cookieStore.remove('one41CookieKey');
            this.broadcastUserStatusChanged();
        };

        user.prototype.getUserProfile = function () {
            return this.profile;
        };

        user.prototype.isUserLogged = function () {
            if (angular.equals(this.profile, undefined)) {
                return false;
            } else {
                return true;
            }
        };

        user.prototype.broadcastUserStatusChanged = function () {
            $rootScope.$broadcast('UserStatusChanged');
        };

        return user;
    }]);