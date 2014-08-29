'use strict';

angular
    .module('schemaAppApp', [
        'ngCookies',
        'ngResource',
        'ngSanitize',
        'ngRoute',
        'dfTable'
    ])
    .constant('DSP_URL', 'http://localhost')
    .constant('DSP_API_KEY', 'data-app')
    .config(['$httpProvider', 'DSP_API_KEY', function ($httpProvider, DSP_API_KEY) {

        // Set default headers for http requests
        $httpProvider.defaults.headers.common["X-DreamFactory-Application-Name"] = DSP_API_KEY;

    }])
    .config(function ($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'views/main.html',
                controller: 'MainCtrl',
                resolve: {
                    getDataServices: [
                        'DSP_URL', '$http', function(DSP_URL, $http) {

                            var requestDataObj = {
                                include_schema: true, filter: 'type_id in (4,4100)'
                            };

                            return $http.get(DSP_URL + '/rest/system/service', {params: requestDataObj});
                        }
                    ]
                }
            })
            .otherwise({
                redirectTo: '/'
            });
    });
