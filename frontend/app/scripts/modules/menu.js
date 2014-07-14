/**
 * Created by vbukinac on 08.07.2014.
 */
'use strict';

angular.module('mMenu', ['ui.bootstrap', 'mServices', 'mLogin'])
.config(function () {
})

.directive('initData', [/*'$scope', 'UserService', */function (/*$scope, UserService*/) {
        return function() {
            //$scope.user = UserService.getUser();
        };
    }])

.controller('DateTimeCtrl', ['$scope', '$interval', 'feDateService', function($scope, $interval, feDateService) {

    function getCurrentTimeInFormatHMS(datetime){
        return feDateService.getCurrentTimeInFormatHMS(datetime);
    }

    var datetimeRefresh;

    $scope.datetime = getCurrentTimeInFormatHMS(new Date());

    datetimeRefresh = $interval(function() {
        $scope.datetime = getCurrentTimeInFormatHMS(new Date());
    }, 1000);
}])

.controller('LoginCtrl', ['$scope', '$modal', '$log', '$cookieStore'/*, 'user'*/, 'UserService', function ($scope, $modal, $log, $cookieStore/*, userOfmMenu*/, UserService) {

    $scope.open = function () {
        $scope.user = {};
        $scope.user.username = '';
        $scope.user.password = '';

        var loginModalInstance = $modal.open({
            templateUrl: 'views/login.html',
            controller: 'LoginModalInstanceCtrl',
            keyboard: true,
            backdrop: 'static',
            windowClass: 'app-modal-window',
            resolve: {
                user: function () {
                    return $scope.user;
                }
            }
        });

        loginModalInstance.result.then(function (response) {
            $scope.user = response.user;
            UserService.setUser($scope.user);

        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });
    };

    $scope.logout = function () {
        $scope.user = {};
        UserService.setUser($scope.user);
    };

    $scope.isUserLogged = function() {
        if (UserService.isUserLogged()) {
            //this is not good - $scope.user should be initialized on other place
            if (angular.equals($scope.user, undefined) || angular.equals($scope.user, {}) || angular.equals($scope.user, null) || angular.equals($scope.user, '')) {
                $scope.user = UserService.getUser();
            }

            return true;
        } else {
            return false;
        }
    };
}]);