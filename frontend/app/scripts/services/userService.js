'use strict';

angular.module('mServices', [])
    .config(function () {
    })

//    .value('user', {})
//    .value('firstTimeCookeiCheck', true)

    .factory('UserService', ['$http', '$rootScope', '$cookieStore', '$q', function ($http, $rootScope, $cookieStore, $q) {

        var user = {};
        var firstTimeCookeiCheck = true;

        return {
            authenticate: function (user) {
                var deferred = $q.defer();
                var data = {'authentication': {'username': user.username, 'password': user.password}};

                $http.post('/rest/user/authenticate', data)
                    .success(function (data/*, status, headers, scope*/) {
                        deferred.resolve(data);
                    })
                    .error(function (/*data, */status/*, headers, scope*/) {
                        deferred.reject(status);
                    });

                return deferred.promise;
            },

            getUser: function () {
                if ((angular.equals(user, {}) || (angular.equals(user, undefined)))) {
                    user = $cookieStore.get('one41CookieKey');
                }

                return user;
            },

            setUser: function (newUser) {
                user = newUser;

                if (angular.equals(user, {})) {
                    $cookieStore.remove('one41CookieKey');
                } else {
                    $cookieStore.put('one41CookieKey', user);
                }
            },

            isUserLogged: function () {
                if (firstTimeCookeiCheck) {
                    firstTimeCookeiCheck = false;
                    this.getUser();
                }

                if ((angular.equals(user, {}) || (angular.equals(user, undefined)))) {
                    return false;
                } else {
                    return true;
                }
            },

            broadcastUserStatusChanged: function () {
                $rootScope.$broadcast('UserStatusChanged');
            }
        };
    }]);

