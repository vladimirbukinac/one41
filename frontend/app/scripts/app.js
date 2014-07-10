/**
 * Created by vbukinac on 08.07.2014.
 */
'use strict';

angular
    .module('one41feApp', [
        'ngAnimate',
        'ngCookies',
        'ngResource',
        'ngRoute',
        'ngSanitize',
        'ngTouch',
        'restangular',
        'mMenu',
        'mPosts'
    ])

    .config(function(RestangularProvider){

        //RestangularProvider.setBaseUrl("${RestEndpoint}");
        RestangularProvider.setBaseUrl('http://localhost:8080/rest');

        RestangularProvider.setResponseExtractor(function(response) {
            var newResponse = response.payload;
            if (angular.isArray(newResponse)) {
                angular.forEach(newResponse, function(value, key) {
                    if (newResponse[key] !== undefined){
                        newResponse[key].originalElement = angular.copy(value);
                    }
                });
            } else {
                if (newResponse !== undefined) {
                    newResponse.originalElement = angular.copy(newResponse);
                }
            }
            return newResponse;

        });
});


/*  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });*/
