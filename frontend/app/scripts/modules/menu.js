'use strict';

angular.module('mMenu', ['ui.bootstrap', 'mServices', 'mLogin'])
    .config(function () {
    })

    .directive('initData', ['$rootScope', function ($rootScope) {
        return function () {
            $rootScope.$broadcast('UserStatusChanged');
        };
    }])

    .controller('DateTimeCtrl', ['$scope', '$interval', 'feDateService', function ($scope, $interval, feDateService) {
        var datetimeRefresh;

        $scope.datetime = feDateService.getCurrentTimeInFormatHMS(new Date());

        datetimeRefresh = $interval(function () {
            $scope.datetime = feDateService.getCurrentTimeInFormatHMS(new Date());
        }, 1000);

    }])

    .controller('LoginCtrl', ['$scope', '$modal', '$log', '$timeout', 'UserService', function ($scope, $modal, $log, $timeout, UserService) {

        $scope.login = function () {
            var loginModalInstance = $modal.open({
                templateUrl: 'views/login.html',
                controller: 'LoginModalInstanceCtrl',
                keyboard: true,
                backdrop: 'static',
                windowClass: 'app-modal-window'
            });

            loginModalInstance.result.then(function () {
                $scope.user = UserService.getUser().getUserProfile();
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        };

        $scope.register = function () {
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

        $scope.logout = function () {
            UserService.getUser().logout();
        };

        $scope.$on('UserStatusChanged', function () {
            $scope.user = UserService.getUser().getUserProfile();
        });

        $scope.isUserLogged = function () {
            return UserService.getUser().isUserLogged();
        };
    }]);