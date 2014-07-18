/**
 * Created by vbukinac on 08.07.2014.
 */
'use strict';

angular.module('mPosts', ['mServices'])
.config(function () {
})

.controller('PostsCtrl', ['$rootScope', '$scope', '$log', '$interval', 'UserService', 'PostService', 'feDateService',
                function ($rootScope, $scope, $log, $interval, UserService, PostService, feDateService) {
        $scope.showFeedback = false;

        var postsRefresh;

        postsRefresh = $interval(function() {
            $scope.getPosts();
        }, 30000);

        function showAlert(type, message) {
            $scope.status  = message;
            $scope.showFeedback = true;
            $scope.alertType = type;
        }

        $scope.getPosts = function() {
            // this should be without user token - now token is necessary
            if (UserService.isUserLogged()) {
                PostService.getPosts(UserService.getUser().token).then(function (result) {
                    if (!(angular.equals(result, null) || angular.equals(result, {}) || angular.equals(result, undefined) || angular.equals(result, ''))) {
                        for (var i = 0; i < result.messages.length; i++){
                            result.messages[i].message.creationDate = feDateService.getCurrentDateTimeInFormatDMYHMS(new Date(result.messages[i].message.creationDate));

                            $scope.getMessageWithImages(result.messages[i].message);
                        }

                        $scope.listOfPosts = result.messages;
                    } else {
                        $scope.listOfPosts = null;
                    }

                    // this is not needed just to have some message
                    if (result.length === 0) {
                        showAlert('warning', 'No messages!');
                    } else {
                        $scope.showFeedback = false;
                    }
                }, function (e) {
                    showAlert('error', e);
                });
            } else {
                $scope.listOfPosts = null;
            }
        };

        $scope.getMessageWithImages = function(post) {
            PostService.getMessageWithImages(UserService.getUser().token, post.id).then(function (result) {
                console.log(result);

            }, function (e) {
                showAlert('error', e);
            });
        };

        $scope.deletePost = function(list, post, index) {
            PostService.deletePost(UserService.getUser().token, post.id).then(function () {
                list.splice(index, 1);
            }, function (e) {
                showAlert('error', e);
            });
        };

        $scope.$on('UserStatusChanged', function(){
            $scope.getPosts();
        });

        $scope.closeAlert = function(){
            $scope.showFeedback = false;
        };

        $scope.isUserLogged = function() {
            return UserService.isUserLogged();
        };

        $scope.isUsersPost = function(post) {
            if (UserService.getUser().id === post.userId) {
                return true;
            } else {
                return false;
            }
        };
    }]);
