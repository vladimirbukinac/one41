'use strict';

angular.module('mServicesMock', [])
    .factory('feDateServiceMock', function () {
        return {
            getCurrentDateTimeInFormatDMYHMS: function() {
                return '18.07.2014 14:54:32';
            },

            getCurrentTimeInFormatHMS: function() {
                return '18.07.2014'
            }
        };
    });