/**
 * Created by vbukinac on 14.07.2014.
 */
'use strict';

angular.module('mServices')
.factory('PostService', ['$http', '$q', function($http, $q) {

    return {
        getPosts: function(token) {
            var deferred = $q.defer();
            var data = {'token': {'token': token}};

            $http.post('/rest/message/latest', data)
                .success(function (data/*, status, headers, scope*/) {
                    //console.log(data);
                    deferred.resolve(data);
                })
                .error(function (/*data, */status/*, headers, scope*/) {
                    //console.log(status);
                    deferred.reject(status);
                });

            return deferred.promise;
        }
    };
}]);
