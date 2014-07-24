'use strict';

angular.module('mPosts', ['mServices'])
    .config(function () {
    })

    .controller('PostsCtrl', ['$rootScope', '$scope', '$log', '$interval', 'UserService', 'Posts', 'feDateService', 'FrontendProperties',
        function ($rootScope, $scope, $log, $interval, UserService, Posts, feDateService, FrontendProperties) {
            $scope.posts = new Posts();

            var postsRefresh;

            $scope.showFeedback = false;

            $scope.showImage = function (image) {
                $scope.someImage = 'data:image/*;base64,' + image;
            };

            postsRefresh = $interval(function () {
                $scope.getPosts();
            }, FrontendProperties.getFrontendProperties().postsListRefreshTime * 1000);

            function showAlert(type, message) {
                $scope.status = message;
                $scope.showFeedback = true;
                $scope.alertType = type;
            }

            $scope.getPosts = function () {
                // this should be without user token - now token is necessary
                if (UserService.getUser().isUserLogged()) {
                    $scope.posts.getPosts(UserService.getUser().getUserProfile().token).then(function (result) {
                        if (angular.equals(result.error, undefined)) {

                            $scope.showFeedback = false;
                        } else {
                            $scope.posts.listOfPosts = [];

                            switch (result.error.errortype) {
                                case 'TOKEN_EXPIRED':
                                    showAlert('error', 'Token is expired!');
                                    break;
                                case 'TOKEN_INVALID':
                                    showAlert('error', 'Token is invalid!');
                                    break;
                                default:
                                    showAlert('error', 'Unknown error!');
                            }
                        }
                    }, function (e) {
                        showAlert('error', e);
                    });
                } else {
                    $scope.posts.listOfPosts = [];
                }
            };

            $scope.deletePost = function (list, post, index) {
                $scope.posts.deletePost(UserService.getUser().getUserProfile().token, post.id).then(function () {
                    list.splice(index, 1);
                }, function (e) {
                    showAlert('error', e);
                });
            };

            $scope.$on('UserStatusChanged', function () {
                $scope.getPosts();
            });

            $scope.closeAlert = function () {
                $scope.showFeedback = false;
            };

            $scope.isUserLogged = function () {
                return UserService.getUser().isUserLogged();
            };

            $scope.isUsersPost = function (post) {
                return (angular.equals(UserService.getUser().getUserProfile().id, post.userId));
            };
        }]);
