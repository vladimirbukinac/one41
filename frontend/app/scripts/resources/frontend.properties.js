'use strict';

angular.module('feProperties', [])
    .factory('FrontendProperties', [function () {
        var frontendProperties = {
            'postsListRefreshTime': 30
        };

        return {
            getFrontendProperties: function () {
                return frontendProperties;
            }
        };
    }]);