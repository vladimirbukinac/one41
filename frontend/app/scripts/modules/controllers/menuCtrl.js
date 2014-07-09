/**
 * Created by vbukinac on 08.07.2014.
 */
'use strict';

angular.module('mMenu')
    .controller('MenuCtrl', ['$scope', '$interval', 'feDateService', function($scope, $interval, feDateService) {

        function getCurrentTimeInFormatHMS(){
            return feDateService.getCurrentTimeInFormatHMS();
        }

        var datetimeRefresh;

        $scope.datetime = getCurrentTimeInFormatHMS();

        datetimeRefresh = $interval(function() {
            $scope.datetime = getCurrentTimeInFormatHMS();
        }, 1000);
}]);
