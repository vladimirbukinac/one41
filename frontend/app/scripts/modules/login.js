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

                    UserService.getUser().login($scope.user.username, $scope.user.password).then(function (data) {
                        if (angular.equals(data.error, undefined)) {
                            $modalInstance.close();
                        } else {
                            switch (data.error.errortype) {
                                case 'AUTHENTICATE_INVALID_CREDENTIALS':
                                    showAlert('error', 'Invalid credentials!');
                                    break;
                                default:
                                    showAlert('error', 'Unknown error!');
                            }
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


