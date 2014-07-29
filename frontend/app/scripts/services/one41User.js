'use strict';

angular.module('mServices')
    .factory('One41User', ['$rootScope', '$cookieStore', '$q', '$http', function ($rootScope, $cookieStore, $q, $http) {

        var One41User = function () {
            this.profile = $cookieStore.get('one41CookieKey');
        };

        One41User.prototype.login = function (username, password) {
            var deferred = $q.defer();
            var data = {authentication: {username: username, password: password}};

            var self = this;

            $http.post('/rest/user/authenticate', data)
                .success(function (data, status) {
                    if (angular.equals(data.error, undefined)) {
                        self.profile = data.user;
                        $cookieStore.put('one41CookieKey', data.user);
                        self.broadcastUserStatusChanged();
                    } else {
                        if (!angular.equals(self.profile, undefined)) {
                            self.logout();
                        }
                    }

                    deferred.resolve(data, status);
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
            return (!angular.equals(this.profile, undefined));
        };

        One41User.prototype.broadcastUserStatusChanged = function () {
            $rootScope.$broadcast('UserStatusChanged');
        };

        One41User.prototype.register = function (user) {
            var deferred = $q.defer();
            var data = {'user': {'email': user.email, 'username': user.username, 'password': user.password, 'firstName': user.firstName, 'lastName': user.lastName, 'pictureUrl': user.pictureUrl}};

            $http.post('/rest/user/create', data)
                .success(function (data, status) {
                    deferred.resolve(data, status);
                })
                .error(function (status) {
                    deferred.reject(status);
                });

            return deferred.promise;
        };

        return One41User;
    }]);