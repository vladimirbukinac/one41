/**
 * Created by vbukinac on 09.07.2014.
 */
'use strict';

angular.module('mLogin', [])
.config(function () {
})

.controller('LoginModalInstanceCtrl', ['$rootScope', '$scope', '$modalInstance', '$log', 'user', 'LoginService',
                               function ($rootScope, $scope, $modalInstance, $log, user, LoginService) {

    $scope.user = user;

    $scope.login = function () {
        if (!(angular.equals($scope.user.username, null) || angular.equals($scope.user.username, '') || angular.equals($scope.user.username, undefined) ||
              angular.equals($scope.user.password, null) || angular.equals($scope.user.password, '') || angular.equals($scope.user.password, undefined))) {

             LoginService.checkUser(user).then(function(result) {
                if (!(angular.equals(result, null) || angular.equals(result, '') || angular.equals(result, undefined))) {
                    //$log.info(result);
                    $modalInstance.close(result);
                } else {
                    // this should be replaced with ngMessage or new directive
                    $rootScope.error = 'Bad credentials!';
                }

            }, function(status) {
                 $log.info(status);
            });
        }
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
}]);


