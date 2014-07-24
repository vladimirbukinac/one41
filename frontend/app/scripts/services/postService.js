'use strict';

angular.module('mServices')
    .factory('Posts', ['$http', '$q', 'feDateService', 'UserService', function ($http, $q, feDateService, UserService) {

        var Posts = function () {
            this.listOfPosts = [];
        };

        Posts.prototype.getPosts = function (token) {
            var deferred = $q.defer();
            var data = {'token': {'token': token}};

            var self = this;

            $http.post('/rest/message/latest', data)
                .success(function (data, status) {
                    if (angular.equals(data.error, undefined)) {

                        self.listOfPosts = data.messages;

                        for (var i = 0; i < self.listOfPosts.length; i++) {
                            self.listOfPosts[i].message.creationDate = feDateService.getCurrentDateTimeInFormatDMYHMS(new Date(self.listOfPosts[i].message.creationDate));

                            self.populateImages(UserService.getUser().getUserProfile().token, self.listOfPosts[i].message);
                        }
                    }

                    deferred.resolve(data, status);
                })
                .error(function (status) {
                    deferred.reject(status);
                });

            return deferred.promise;
        };

        Posts.prototype.deletePost = function (token, id) {
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
        };

        Posts.prototype.populateImages = function (token, post) {
            var deferred = $q.defer();
            var data = {'message': {'id': post.id, 'token': token}};

            $http.post('/rest/message/get', data)
                .success(function (data, status) {
                    post.images = data.message.images;
                    deferred.resolve(status);
                })
                .error(function (status) {
                    deferred.reject(status);
                });

            return deferred.promise;
        };

        return Posts;
    }]);