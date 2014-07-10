/**
 * Created by vbukinac on 09.07.2014.
 */
'use strict';

angular.module('mLogin', [])
.config(function () {
})

.controller('LoginModalInstanceCtrl', ['$rootScope', '$scope', '$modalInstance', 'user', 'HttpLoginService',
                               function ($rootScope, $scope, $modalInstance, user, HttpLoginService) {

    $scope.user = user;

    $scope.login = function () {
        if (!(angular.equals($scope.user.username, null) || angular.equals($scope.user.username, '') || angular.equals($scope.user.username, undefined) ||
              angular.equals($scope.user.password, null) || angular.equals($scope.user.password, '') || angular.equals($scope.user.password, undefined))) {

             HttpLoginService.checkUser(user).then(function(result) {
                if (!(angular.equals(result, null) || angular.equals(result, '') || angular.equals(result, undefined))) {
                    console.log(result);
                    $modalInstance.close(result);
                } else {
                    // this should be replaced with ng error
                    $rootScope.error = 'Bad credentials!';
                }

            }, function(status) {
                console.log(status);
            });
        }
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
}]);

