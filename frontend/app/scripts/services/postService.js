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
                .success(function (data) {
                    deferred.resolve(data);
                })
                .error(function (status) {
                    deferred.reject(status);
                });

            return deferred.promise;
        },

        deletePost: function (token, id) {
            var deferred = $q.defer();
            var data = {'message': {'id': id, 'token': token}};

            $http.post('/rest/message/delete', data)
                .success(function () {
                    deferred.resolve();
                })
                .error(function (status) {
                    deferred.reject(status);
                });

            return deferred.promise;
        }
    };
}]);
