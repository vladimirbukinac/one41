'use strict';

angular.module('mProfile', ['mServices'])
    .config(function () {

    })

    .controller('ProfileCtrl', ['$scope', 'UserService', function ($scope, UserService) {

        $scope.isUserLogged = function () {
            return UserService.getUser().isUserLogged();
        };
    }]);