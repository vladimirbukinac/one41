'use strict';

angular.module('mServices', [])
    .config(function () {
    })

    .service('UserService', ['$http', '$rootScope', '$cookieStore', '$q', 'One41User', function ($http, $rootScope, $cookieStore, $q, One41User) {

        var user = new One41User();

        return {
            getUser: function () {
                return user;
            }

        };
    }]);

