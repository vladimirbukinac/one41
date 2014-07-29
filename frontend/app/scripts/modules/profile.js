'use strict';

angular.module('mProfile', [])
    .config(function () {
    })

    .controller('ProfileModalInstanceCtrl', ['$rootScope', '$scope', '$modalInstance', '$log', 'UserService',
        function ($rootScope, $scope, $modalInstance, $log, UserService) {
            $scope.showFeedback = false;
            $scope.user = {};

            $scope.register = function () {
                $log.info($scope.email);
                UserService.getUser().register($scope.user).then(function (data) {
                        if (angular.equals(data.error, undefined)) {
                            UserService.getUser().login($scope.user.username, $scope.user.password);
                            $modalInstance.close();
                        } else {
                            switch (data.error.errortype) {
                                case 'SERVICE_ILLEGAL_OPERATION':
                                    showAlert('error', 'Unable to register a new user!');
                                    break;
                                default:
                                    showAlert('error', 'Unknown error!');
                            }
                        }
                    }, function (status) {
                        showAlert('error', status);
                    });

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


