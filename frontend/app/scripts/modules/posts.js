/**
 * Created by vbukinac on 08.07.2014.
 */
'use strict';

angular.module('mPosts', ['mServices'])
.config(function () {
})

/*.controller('PostsCtrl', function($scope) {
    $scope.name = 'Here we need list of 10 posts';
});*/

.controller('TestCtrl', ['$scope', function($scope){

        $scope.showLog = function () {
                console.log('test');
        };
    }])

.controller('PostsCtrl', ['$rootScope', '$scope', '$log', 'UserService', 'PostService', 'feDateService', function ($rootScope, $scope, $log, UserService, PostService, feDateService) {
        $scope.showFeedback = false;
        $scope.user = UserService.getUser();

        function getCurrentDateTimeInFormatDMYHMS(datetime){
            return feDateService.getCurrentDateTimeInFormatDMYHMS(datetime);
        }

        $scope.getPosts = function() {
            //$log.info($scope.user.token);

            // this should be without user token - now token is necessary
            if (UserService.isUserLogged()) {
                PostService.getPosts($scope.user.token).then(function (result) {
                    $log.info(result);

                    if (!(angular.equals(result, null) || angular.equals(result, {}) || angular.equals(result, undefined) || angular.equals(result, ''))) {
                        for (var i = 0; i < result.ArrayList.length; i++){
                            result.ArrayList[i].creationDate = getCurrentDateTimeInFormatDMYHMS(new Date(result.ArrayList[i].creationDate));
                        }

                        $scope.listOfPosts = result.ArrayList;
                    } else {
                        $scope.listOfPosts = null;
                    }

                    if (result.length === 0) {
                        showAlert('warning', 'No messages!');
                    } else {
                        showAlert('info', 'Found ' + result.length + ' messages!');
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
            $scope.showFeedback = 'true';
            $scope.alertType = type;
        }
    }]);
