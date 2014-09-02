'use strict';

angular.module('schemaAppApp')
    .controller('MainCtrl', function ($scope, DSP_URL, getDataServices) {

        $scope.__getDataFromResponse = function (httpResponseObj) {
            return httpResponseObj.data.record;
        };


        $scope.__services__ = $scope.__getDataFromResponse(getDataServices);

        $scope.selected = {
            service: null,
            resource: null
        };

        $scope.options = {
            service: $scope.selected.service,
            table: $scope.selected.resource,
            url: DSP_URL + '/rest/' + $scope.selected.service + '/' + $scope.selected.resource,
            allowChildTable: true,
            childTableAttachPoint: '#child-table-attach'
        };

        $scope.$watchCollection('selected', function (newValue, oldValue) {

            var options = {
                service: newValue.service,
                table: newValue.resource,
                url: DSP_URL + '/rest/' + newValue.service + '/' + newValue.resource,
                allowChildTable: true,
                childTableAttachPoint: '#child-table-attach'
            };

            $scope.options = options;

        });
    })
    .directive('dfServicePicker', ['DSP_URL', '$http', function (DSP_URL, $http) {

            return {
                restrict: 'E',
                scope: {
                    services: '=?',
                    selected: '=?'
                },
                templateUrl: 'views/df-service-picker.html', link: function (scope, elem, attrs) {

                    scope.resources = [];
                    scope.activeResource = null;
                    scope.activeService = null;

                    // PUBLIC API
                    scope.setServiceAndResource = function () {

                        if (scope._checkForActive()) {
                            scope._setServiceAndResource();
                        }
                    };

                    // PRIVATE API
                    scope._getResources = function () {
                        return $http(
                            {
                                method: 'GET', url: DSP_URL + '/rest/' + scope.activeService
                            }
                        )
                    };

                    // COMPLEX IMPLEMENTATION
                    scope._setServiceAndResource = function () {
                        scope.selected = {
                            service: scope.activeService, resource: scope.activeResource
                        };
                    };

                    scope._checkForActive = function () {

                        return !!scope.activeResource && scope.activeService;
                    };

                    // WATCHERS AND INIT
                    scope.$watch(
                        'activeService', function (newValue, oldValue) {

                            if (!newValue) {
                                scope.resources = [];
                                scope.activeResource = null;
                                return false;
                            }

                            scope.resources = [];

                            scope._getResources().then(
                                function (result) {

                                    scope.resources = result.data.resource;
                                },

                                function (reject) {
                                    throw {
                                        module: 'DreamFactory Utility Module', type: 'error', provider: 'dreamfactory', exception: reject
                                    }
                                }
                            )
                        }
                    );

                    // MESSAGES
                }
            }
        }
    ]);
