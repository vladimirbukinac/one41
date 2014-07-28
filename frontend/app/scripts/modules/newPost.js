'use strict';

angular.module('mNewPost', ['mServices'])
    .config(function () {
    })

    .controller('NewPostCtrl', ['$scope', '$modal', '$log', '$cookieStore', '$timeout', 'UserService', function ($scope, $modal, $log, $cookieStore, $timeout, UserService) {



        $scope.newPost = function () {

            var newPostModalInstance = $modal.open({
                templateUrl: 'views/newPost.html',
                controller: 'NewPostModalInstanceCtrl',
                keyboard: true,
                backdrop: 'true',
                windowClass: 'app-modal-window'
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

    .factory('NewPostModel',['$http', '$q', 'UserService', '$upload', function($http, $q, UserService, $upload){

        var newPost = function (){
            this.text = 'newPost... ';

        };

        newPost.prototype.postMessageWorks = function () {
            var deferred = $q.defer();
            var message = {};
            message.text = this.text;
            message.images = this.images;
            message.token = UserService.getUser().getUserProfile().token;
            var file = this.images[0].image;
            //file.getAsBinary();

            var fd = new FormData();
            fd.append('file', file);
            $http.post('/rest/message/createWithMultipart', fd, {
                transformRequest: angular.identity,
                headers: {'Content-Type': undefined}
            })
                .success(function(data){
                    deferred.resolve(data);
                })
                .error(function(status){
                    deferred.reject(status);
                });
            return deferred.promise;
        };

        newPost.prototype.postMessageWithUpload = function () {
            var deferred = $q.defer();
            var message = {};
            message.text = this.text;
            message.images = this.images;
            message.token = UserService.getUser().getUserProfile().token;
            var data = this.images[0].image;
            var fd = new FormData();
            fd.append('file', data);

            var upload = $upload.upload({
                url: '/rest/message/createWithMultipartDTO', //upload.php script, node.js route, or servlet url
                method: 'POST', //method: 'POST' or 'PUT',
                //headers: {'header-key': 'header-value'},
                //headers: {'content-type': 'multipart/form-data; boundary=here'},
                //withCredentials: true,
                data: {'message': message},
                //data: fd,
                file: data //, // or list of files ($files) for html5 only
                //fileFormDataName: 'file',
                //fileName: 'file'
                //transformRequest: function(data) { return data; }
                //fileName: 'doc.jpg' or ['1.jpg', '2.jpg', ...] // to modify the name of the file(s)
                // customize file formData name ('Content-Desposition'), server side file variable name.
                //fileFormDataName: myFile, //or a list of names for multiple files (html5). Default is 'file'
                // customize how data is added to formData. See #40#issuecomment-28612000 for sample code
                //formDataAppender: function(formData, key, val){}
            }).progress(function(evt) {
                console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total));
            }).success(function(data, status, headers, config) {
                // file is uploaded successfully
                console.log(data);
                deferred.resolve(data);
            });

            return deferred.promise;
        };


        newPost.prototype.postMessageDeadEnd = function () {
            var deferred = $q.defer();
            var message = {};
            message.text = this.text;
            message.images = this.images;
            message.token = UserService.getUser().getUserProfile().token;
            var data = this.images[0].image;
            var fd = new FormData();
            fd.append('message', {text: 'ddddd'});

            var upload = $upload.upload({
                url: '/rest/message/createWithMultipartDTO', //upload.php script, node.js route, or servlet url
                method: 'POST', //method: 'POST' or 'PUT',
                //headers: {'header-key': 'header-value'},
                //headers: {'content-type': 'multipart/form-data; boundary=here'},
                //withCredentials: true,
                data: {message: {text: 'rrrrr'}},
                //data: fd,
                file: data //, // or list of files ($files) for html5 only
                //fileFormDataName: 'file',
                //fileName: 'file'
                //transformRequest: function(data) { return data; }
                //fileName: 'doc.jpg' or ['1.jpg', '2.jpg', ...] // to modify the name of the file(s)
                // customize file formData name ('Content-Desposition'), server side file variable name.
                //fileFormDataName: myFile, //or a list of names for multiple files (html5). Default is 'file'
                // customize how data is added to formData. See #40#issuecomment-28612000 for sample code
                //formDataAppender: function(formData, key, val){}
            }).progress(function(evt) {
                console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total));
            }).success(function(data, status, headers, config) {
                // file is uploaded successfully
                console.log(data);
                deferred.resolve(data);
            });

            return deferred.promise;
        };






        newPost.prototype.postMessageOriginal = function () {
            var deferred = $q.defer();
            var message = {};
            message.text = this.text;
            message.images = this.images;
            message.token = UserService.getUser().getUserProfile().token;
            var data = {'message': message};

            $http.post('/rest/message/createWithMultipartDTO', data)
                .success(function(data){
                    deferred.resolve(data);
                })
                .error(function(status){
                    deferred.reject(status);
                });
            return deferred.promise;
        };


        newPost.prototype.postMessage = function () {
            var deferred = $q.defer();
            var message = {};
            message.text = this.text;
            message.images = this.images;
            message.token = UserService.getUser().getUserProfile().token;
            var data = {'message': message};

            $http.post('/rest/message/create', data)
                .success(function(data){
                    deferred.resolve(data);
                })
                .error(function(status){
                    deferred.reject(status);
                });
            return deferred.promise;
        };


        newPost.prototype.postMessageMP = function () {
            var deferred = $q.defer();
            var message = {};
            message.text = this.text;
            message.images = this.images;
            //message.files = this.files;
            message.token = UserService.getUser().getUserProfile().token;

            var reader = new FileReader();

            reader.onload = function(e) {
                //message.testData = reader.result;
                message.testData = reader.result.split("base64,")[1];


                var upload = $upload.upload({
                    url: '/rest/message/createWithAttachment', //upload.php script, node.js route, or servlet url
                    method: 'POST', //method: 'POST' or 'PUT',
                    //headers: {'header-key': 'header-value'},
                    //headers: {'content-type': 'multipart/form-data; boundary=here'},
                    //withCredentials: true,
                    data: {'message': message},
                    //data: fd,
                    //file: data //, // or list of files ($files) for html5 only
                    file: this.files
                    //fileFormDataName: 'file',
                    //fileName: 'file'
                    //transformRequest: function(data) { return data; }
                    //fileName: 'doc.jpg' or ['1.jpg', '2.jpg', ...] // to modify the name of the file(s)
                    // customize file formData name ('Content-Desposition'), server side file variable name.
                    //fileFormDataName: myFile, //or a list of names for multiple files (html5). Default is 'file'
                    // customize how data is added to formData. See #40#issuecomment-28612000 for sample code
                    //formDataAppender: function(formData, key, val){}
                }).progress(function(evt) {
                    console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total));
                }).success(function(data, status, headers, config) {
                    // file is uploaded successfully
                    console.log(data);
                    deferred.resolve(data);
                });
            }

           //reader.readAsBinaryString(this.files[0]);
            reader.readAsDataURL(this.files[0]);


            //message.testData = this.files[0].getAsText("")
            //var data = this.images[0].image;
            //var fd = new FormData();
            //fd.append('file', data);
/*
            var upload = $upload.upload({
                url: '/rest/message/createWithAttachment', //upload.php script, node.js route, or servlet url
                method: 'POST', //method: 'POST' or 'PUT',
                //headers: {'header-key': 'header-value'},
                //headers: {'content-type': 'multipart/form-data; boundary=here'},
                //withCredentials: true,
                data: {'message': message},
                //data: fd,
                //file: data //, // or list of files ($files) for html5 only
                file: this.files
                //fileFormDataName: 'file',
                //fileName: 'file'
                //transformRequest: function(data) { return data; }
                //fileName: 'doc.jpg' or ['1.jpg', '2.jpg', ...] // to modify the name of the file(s)
                // customize file formData name ('Content-Desposition'), server side file variable name.
                //fileFormDataName: myFile, //or a list of names for multiple files (html5). Default is 'file'
                // customize how data is added to formData. See #40#issuecomment-28612000 for sample code
                //formDataAppender: function(formData, key, val){}
            }).progress(function(evt) {
                console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total));
            }).success(function(data, status, headers, config) {
                // file is uploaded successfully
                console.log(data);
                deferred.resolve(data);
            });
*/
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

            $scope.message.files = $files;

            /*$scope.message.images = [];
            for (var i = 0; i < $files.length; i++) {
                var file = $files[i];
                var image = {};
                image.name = 'file' + i;//file.name;
                image.imageMultipart = file;
                image.image = file;
                $scope.message.images.push(image);
            }*/

            $scope.message.images = [];
            for (var i = 0; i < $files.length; i++) { //for multiple files
                (function(file) {
                    var name = file.name;
                    var reader = new FileReader();
                    reader.onload = function(e) {
                        // get file content

                        var image = {};
                        image.name = name;
                        image.image = reader.result.split("base64,")[1];
                        $scope.message.images.push({image: image});
                    }
                    reader.readAsDataURL(file);
                })($files[i]);
            }
        }


    }]);