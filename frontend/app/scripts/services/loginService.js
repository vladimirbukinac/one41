'use strict';

angular.module('mServices')
    .factory('LoginService', ['$http', '$q', function ($http, $q) {

        return {
            checkUser: function (user) {
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
            }
        };
    }]);



