/**
 * Created by vbukinac on 08.07.2014.
 */
'use strict';

angular.module('mMenu', ['ui.bootstrap', 'mLogin'])
    .config(function () {
    })

    .value('user', {})

    .controller('DateTimeCtrl', ['$scope', '$interval', 'feDateService', function($scope, $interval, feDateService) {

        function getCurrentTimeInFormatHMS(){
            return feDateService.getCurrentTimeInFormatHMS();
        }

        var datetimeRefresh;

        $scope.datetime = getCurrentTimeInFormatHMS();

        datetimeRefresh = $interval(function() {
            $scope.datetime = getCurrentTimeInFormatHMS();
        }, 1000);
    }])

    .controller('LoginCtrl', ['$scope', '$modal', '$log', 'user', function ($scope, $modal, $log, userOfmMenu) {

    $scope.open = function () {

        // here we define user
        $scope.user = {};
        $scope.user.username = '';
        $scope.user.password = '';
        $scope.user.token = '';


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

        loginModalInstance.result.then(function (user) {
            userOfmMenu = user;
        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });
    };
}]);
