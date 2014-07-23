'use strict';

angular.module('mLogin', [])
    .config(function () {
    })

    .controller('LoginModalInstanceCtrl', ['$rootScope', '$scope', '$modalInstance', '$log', 'UserService',
        function ($rootScope, $scope, $modalInstance, $log, UserService) {
            $scope.showFeedback = false;
            $scope.user = {'username': null, 'password': null};

            $scope.login = function () {
                if (!(angular.equals($scope.user.username, null) || angular.equals($scope.user.username, '') || angular.equals($scope.user.username, undefined) ||
                    angular.equals($scope.user.password, null) || angular.equals($scope.user.password, '') || angular.equals($scope.user.password, undefined))) {

                    UserService.authenticate($scope.user).then(function (result) {
                        if (!(angular.equals(result, null) || angular.equals(result, '') || angular.equals(result, undefined))) {
                            $modalInstance.close(result);
                        } else {
                            showAlert('error', 'Bad credentials!');
                        }

                    }, function (status) {
                        showAlert('error', status);
                    });
                }
            };

            $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
            };

            $scope.closeAlert = function () {
                $scope.showFeedback = false;
            };

            function showAlert(type, message) {
                $scope.status = message;
                $scope.showFeedback = true;
                $scope.alertType = type;
            }
        }]);


