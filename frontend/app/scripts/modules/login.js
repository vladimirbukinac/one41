/**
 * Created by vbukinac on 09.07.2014.
 */
'use strict';

angular.module('mLogin', [])
    .config(function () {
    })

    .controller('LoginModalInstanceCtrl', function ($scope, $modalInstance, user) {

        $scope.user = user;

        $scope.login = function () {
            if (!(angular.equals($scope.user.username, null) || angular.equals($scope.user.username, '') || angular.equals($scope.user.username, undefined) ||
                  angular.equals($scope.user.password, null) || angular.equals($scope.user.password, '') || angular.equals($scope.user.password, undefined))) {

                // here we need to add call for rest api service to get user info and token

                // here we have to return user with token
                $modalInstance.close($scope.user);
            }
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    });

