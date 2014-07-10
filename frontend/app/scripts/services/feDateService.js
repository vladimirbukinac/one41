'use strict';

angular.module('one41feApp')
.factory('feDateService', function () {
    return {
        getCurrentDateTimeInFormatDMYHMS: function() {
            var datetime = new Date();
            var year = datetime.getFullYear();
            var month = ('0' + (datetime.getMonth() + 1)).slice(-2);
            var day = ('0' + datetime.getDate()).slice(-2);
            var hours = ('0' + datetime.getHours()).slice(-2);
            var minutes = ('0' + datetime.getMinutes()).slice(-2);
            var seconds = ('0' + datetime.getSeconds()).slice(-2);
            var formattedDateTime = day + '.' + month + '.' + year + ' ' + hours + ':' + minutes + ':' + seconds;

            return formattedDateTime;
        },

        getCurrentTimeInFormatHMS: function() {
            var datetime = new Date();
            var hours = ('0' + datetime.getHours()).slice(-2);
            var minutes = ('0' + datetime.getMinutes()).slice(-2);
            var seconds = ('0' + datetime.getSeconds()).slice(-2);
            var formattedDateTime = hours + ':' + minutes + ':' + seconds;

            return formattedDateTime;
        }
    };
});
