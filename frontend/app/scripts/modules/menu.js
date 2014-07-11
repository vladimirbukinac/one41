/**
 * Created by vbukinac on 08.07.2014.
 */
'use strict';

angular.module('mMenu', ['ui.bootstrap', 'mLogin'])
.config(function () {
})

.value('user', {})
//.value('user', {firstName: 'Vladimir', lastName: 'Bukinac'})

.controller('MenuCtrl', ['$scope', '$cookieStore', 'user', function($scope, $cookieStore, userOfmMenu) {

    $scope.init = function () {
        userOfmMenu = $cookieStore.get('one41CookieKey');
    };
}])

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

.controller('LoginCtrl', ['$scope', '$modal', '$log', '$cookieStore', 'user', function ($scope, $modal, $log, $cookieStore, userOfmMenu) {

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
            userOfmMenu = response.user;
            $cookieStore.put('one41CookieKey', userOfmMenu);

        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });
    };

    $scope.logout = function () {
        $cookieStore.remove('one41CookieKey');
        userOfmMenu = {};
    };

    // this should be as general service for other calls
    // here should only be call for service
    $scope.isUserLogedIn = function() {
        /*if (angular.equals(userOfmMenu, {})) {
            userOfmMenu = $cookieStore.get('one41CookieKey');
        }*/
        $scope.user = userOfmMenu;

//        if ((angular.equals(userOfmMenu, {})) || (angular.equals(userOfmMenu, undefined))) {
        if ((angular.equals($scope.user, {})) || (angular.equals($scope.user, undefined))) {
            return true;
        } else {
            return false;
        }
    };
}]);