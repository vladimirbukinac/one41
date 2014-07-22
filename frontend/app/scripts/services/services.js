'use strict';

angular.module('mServices', [])
    .config(function () {
    })

    .value('user', {})
    .value('firstTimeCookeiCheck', true)

    .factory('UserService', ['$rootScope', '$cookieStore', 'user', 'firstTimeCookeiCheck', function ($rootScope, $cookieStore, user, firstTimeCookeiCheck) {

        return {
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

