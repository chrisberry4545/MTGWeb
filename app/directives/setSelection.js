(function () {
    'use strict';

    angular.module('app').directive('setSelection', function () {

        return {
            scope: {
                setGroups: '=',
                additionalDropdownModel: '=',
                additionalDropdownOptions: '='
            },
            restrict: 'AE',
            templateUrl: '/app/directives/setSelection.html',
            controller: function ($scope, $element) {

                $scope.showExtraOptions = false;

                $scope.displayExtraOptions = function () {
                    $scope.showExtraOptions = true;
                }
            }
        }

    });


})();