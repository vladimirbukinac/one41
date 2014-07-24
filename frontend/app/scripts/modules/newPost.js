'use strict';

angular.module('mNewPost', ['mServices'])
    .config(function () {
    })

    .controller('NewPostCtrl', ['$scope', '$modal', '$log', '$cookieStore', '$timeout', 'UserService', function ($scope, $modal, $log, $cookieStore, $timeout, UserService) {



        $scope.newPost = function () {
            $scope.message = {};
            $scope.message.text = 'Some text...';



            var newPostModalInstance = $modal.open({
                templateUrl: 'views/newPost.html',
                controller: 'NewPostModalInstanceCtrl',
                keyboard: true,
                backdrop: 'true',
                windowClass: 'app-modal-window',
                resolve: {
                    newPostMessage: $scope.message
                }
            });

            newPostModalInstance.result.then(function (response) {
                // $scope.newPost = response.newPost;
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        };

        $scope.isUserLogged = function () {
            return UserService.getUser().isUserLogged();
        };

    }])

    .controller('NewPostModalInstanceCtrl0', ['$scope', 'UserService', '$modalInstance', '$log', 'newPostMessage', function ($scope, UserService, $modalInstance, $log, newPostMessage) {


        //$scope.newPost = {};
        ///$scope.newPost.text = 'Some text 2...';
        $scope.message = newPostMessage;

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };

        $scope.closeAlert = function () {
        };

        function showAlert(type, message) {
        }

    }])



    .factory('NewPostModel',['$http', '$q', 'UserService', function($http, $q, UserService){

        var newPost = function (){
            this.text = 'newPost... ';

        };

        newPost.prototype.postMessage = function () {
            var deferred = $q.defer();
            var message = {};
            message.text = this.text;
            message.images = this.images;
            message.token = UserService.getUser().token;
            var data = {'message': message};

            $http.post('/rest/message/create', data)
                .success(function (data/*, status, headers, scope*/) {
                    deferred.resolve(data);
                })
                .error(function (/*data, */status/*, headers, scope*/) {
                    deferred.reject(status);
                });

            return deferred.promise;
        };

        newPost.prototype.postMessageMultipartTest = function () {
            var deferred = $q.defer();
            var message = {};
            message.text = this.text;
            message.images = this.images;
            message.token = UserService.getUser().token;
            var data = this.images[0].image;

            var config = {headers: {
                'Content-Type': 'multipart/form-data' //'multipart/*; boundary=HereGoes'  //false  // multipart/form-data; boundary=HereGoes
            },
                transformRequest: function(data) {
                    return data;
                }
            };

            $http.post('/rest/message/create', data, config)
                .success(function (data/*, status, headers, scope*/) {
                    deferred.resolve(data);
                })
                .error(function (/*data, */status/*, headers, scope*/) {
                    deferred.reject(status);
                });

            return deferred.promise;
        };

        return newPost;

    }])



    .service('newPostService',['NewPostModel', function (NewPostModel) {
        var newPost = new NewPostModel();
        return {
            getPost: function() {
                return newPost;
            }

        }

    } ])


    .controller('NewPostModalInstanceCtrl', ['$rootScope', '$scope', 'UserService', '$modalInstance', '$log', 'newPostService', function ($rootScope, $scope, UserService, $modalInstance, $log, newPostService) {


        //$scope.newPost = {};
        ///$scope.newPost.text = 'Some text 2...';
        $scope.message = newPostService.getPost();

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };

        $scope.closeAlert = function () {
        };

        $scope.showAlert = function (type, message) {
        };

        $scope.post = function (){

            newPostService.getPost().postMessage().then(function (result) {
                $modalInstance.close('posted!');
                $rootScope.$broadcast('MessagesChanged');
            });
        }

        $scope.onFileSelect = function ($files){

            //$scope.message.images = $files;
            $scope.message.images = [];
            for (var i = 0; i < $files.length; i++) {
                var file = $files[i];
                var image = {};
                image.name = file.name;
                image.imageMultipart = file;
                image.image = file;
                $scope.message.images.push({'image': image});
            }

        }


    }]);