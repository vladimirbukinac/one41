/**
 * Created by vbukinac on 08.07.2014.
 */
'use strict';

angular.module('one41feApp', ['ngAnimate', 'ngCookies', 'ngResource', 'ngRoute', 'ngSanitize', 'ngTouch', 'mServices', 'mMenu', 'mPosts', 'mNewPost', 'mProfile'])
.config(['$httpProvider', function($httpProvider) {
        // Seems to work without these lines. (?)
        //$httpProvider.defaults.useXDomain = true;
        //delete $httpProvider.defaults.headers.common['X-Requested-With'];
    }
    ])

.directive('focusMe', function($timeout) {
    return function(scope, element, attrs) {
        scope.$watch(attrs.focusMe, function() {
            $timeout(function() {
                element.focus();
            }, 500);
        });
    };
});

