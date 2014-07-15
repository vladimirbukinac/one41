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
        }, 10000);

        $scope.getPosts = function() {
            //$log.info($scope.user.token);

            // this should be without user token - now token is necessary
            if (UserService.isUserLogged()) {
                PostService.getPosts(UserService.getUser().token).then(function (result) {
                    $log.info(result);

                    if (!(angular.equals(result, null) || angular.equals(result, {}) || angular.equals(result, undefined) || angular.equals(result, ''))) {
                        for (var i = 0; i < result.ArrayList.length; i++){
                            result.ArrayList[i].creationDate = feDateService.getCurrentDateTimeInFormatDMYHMS(new Date(result.ArrayList[i].creationDate));
                        }

                        $scope.listOfPosts = result.ArrayList;
                    } else {
                        $scope.listOfPosts = null;
                    }

                    if (result.length === 0) {
                        showAlert('warning', 'No messages!');
                    }
                }, function (e) {
                    showAlert('error', e);
                });
            }
        };

        $scope.closeAlert = function(){
            $scope.showFeedback = false;
        };

        function showAlert(type, message) {
            $scope.status  = message;
            $scope.showFeedback = true;
            $scope.alertType = type;
        }

    }]);
