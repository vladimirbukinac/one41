/**
 * Created by vbukinac on 08.07.2014.
 */
'use strict';

angular.module('one41feApp', ['ngAnimate', 'ngCookies', 'ngResource', 'ngRoute', 'ngSanitize', 'ngTouch', 'feProperties', 'mServices', 'mMenu', 'mPosts', 'mNewPost', 'mProfile', 'angularFileUpload'])
    .config(function () {

    })

    .directive('focusMe', function ($timeout) {
        return function (scope, element, attrs) {
            scope.$watch(attrs.focusMe, function () {
                $timeout(function () {
                    element.focus();
                }, 500);
            });
        };
    });

