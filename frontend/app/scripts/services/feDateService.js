'use strict';

angular.module('mServices')
    .factory('feDateService', function () {
        return {
            getCurrentDateTimeInFormatDMYHMS: function (datetime) {
                var year = datetime.getFullYear();
                var month = ('0' + (datetime.getMonth() + 1)).slice(-2);
                var day = ('0' + datetime.getDate()).slice(-2);
                var hours = ('0' + datetime.getHours()).slice(-2);
                var minutes = ('0' + datetime.getMinutes()).slice(-2);
                var seconds = ('0' + datetime.getSeconds()).slice(-2);
                var formattedDateTime = day + '.' + month + '.' + year + ' ' + hours + ':' + minutes + ':' + seconds;

                return formattedDateTime;
            },

            getCurrentTimeInFormatHMS: function (datetime) {
                var hours = ('0' + datetime.getHours()).slice(-2);
                var minutes = ('0' + datetime.getMinutes()).slice(-2);
                var seconds = ('0' + datetime.getSeconds()).slice(-2);
                var formattedDateTime = hours + ':' + minutes + ':' + seconds;

                return formattedDateTime;
            }
        };
    });
