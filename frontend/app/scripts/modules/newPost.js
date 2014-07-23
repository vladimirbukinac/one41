'use strict';

angular.module('mNewPost', ['mServices'])
    .config(function () {
    })

    .controller('NewPostCtrl', ['$scope', 'UserService', function ($scope, UserService) {

        $scope.isUserLogged = function () {
            return UserService.getUser().isUserLogged();
        };
    }]);