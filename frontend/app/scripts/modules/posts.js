'use strict';

angular.module('mPosts', ['mServices'])
    .config(function () {
    })

    .controller('PostsCtrl', ['$rootScope', '$scope', '$log', '$interval', 'UserService', 'PostService', 'feDateService', 'FrontendProperties',
        function ($rootScope, $scope, $log, $interval, UserService, PostService, feDateService, FrontendProperties) {
            $scope.showFeedback = false;

            var postsRefresh;

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
                if (UserService.isUserLogged()) {
                    PostService.getPosts(UserService.getUser().token).then(function (result) {
                        if (angular.equals(result.error, undefined)) {
                            for (var i = 0; i < result.messages.length; i++) {
                                result.messages[i].message.creationDate = feDateService.getCurrentDateTimeInFormatDMYHMS(new Date(result.messages[i].message.creationDate));

                                $scope.getMessageWithImages(result.messages[i].message);
                            }

                            $scope.listOfPosts = result.messages;
                            $scope.showFeedback = false;
                        } else {
                            $scope.listOfPosts = null;

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
                    $scope.listOfPosts = null;
                }
            };

            $scope.getMessageWithImages = function (post) {
                PostService.getMessageWithImages(UserService.getUser().token, post.id).then(function (result) {
                    post.images = result.message.images;
                }, function (e) {
                    showAlert('error', e);
                });
            };

            $scope.deletePost = function (list, post, index) {
                PostService.deletePost(UserService.getUser().token, post.id).then(function () {
                    list.splice(index, 1);
                }, function (e) {
                    showAlert('error', e);
                });
            };

            $scope.$on('UserStatusChanged', function () {
                $scope.getPosts();
            });

            $scope.$on('MessagesChanged', function () {
                $scope.getPosts();
            });


            $scope.closeAlert = function () {
                $scope.showFeedback = false;
            };

            $scope.isUserLogged = function () {
                return UserService.isUserLogged();
            };

            $scope.isUsersPost = function (post) {
                if (UserService.getUser().id === post.userId) {
                    return true;
                } else {
                    return false;
                }
            };
        }]);
