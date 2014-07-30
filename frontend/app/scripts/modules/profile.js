'use strict';

angular.module('mProfile', [])
    .config(function () {
    })

    .controller('ProfileCtrl', ['$scope', '$modal', '$log', 'UserService',
        function ($scope, $modal, $log, UserService) {
            $scope.showProfile = function () {
                var profileModalInstance = $modal.open({
                    templateUrl: 'views/profile.html',
                    controller: 'ProfileModalInstanceCtrl',
                    keyboard: true,
                    backdrop: 'static',
                    windowClass: 'app-modal-window'
                });

                profileModalInstance.result.then(function () {
                    $scope.user = UserService.getUser().getUserProfile();
                }, function () {
                    $log.info('Modal dismissed at: ' + new Date());
                });
            };

            $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
            };

            $scope.closeAlert = function () {
                $scope.showFeedback = false;
            };

            $scope.isUserLogged = function () {
                return UserService.getUser().isUserLogged();
            };

            function showAlert(type, message) {
                $scope.status = message;
                $scope.showFeedback = true;
                $scope.alertType = type;
            }
        }])

    .controller('ProfileModalInstanceCtrl', ['$rootScope', '$scope', '$modalInstance', '$log', 'UserService',
        function ($rootScope, $scope, $modalInstance, $log, UserService) {
            $scope.showFeedback = false;
            $scope.user = UserService.getUser().getUserProfile();

            $scope.register = function () {
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

            $scope.update = function () {
                UserService.getUser().update($scope.user).then(function (data) {
                    if (angular.equals(data.error, undefined)) {
                        $modalInstance.close();
                    } else {
                        switch (data.error.errortype) {
                            case 'SERVICE_ILLEGAL_OPERATION':
                                showAlert('error', 'Unable to update existing user!');
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

            $scope.isUserLogged = function () {
                return UserService.getUser().isUserLogged();
            };

            function showAlert(type, message) {
                $scope.status = message;
                $scope.showFeedback = true;
                $scope.alertType = type;
            }
        }]);


