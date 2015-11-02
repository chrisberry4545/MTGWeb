(function () {
    'use strict';

    angular.module('app').directive('cardDisplay', function () {
        return {
            scope: {
                title: '@',
                cards: '=',
                cardClick: '&',
                landCards: '=',
                landCardClick: '&',
                instructions: '@'
            },
            restrict: 'AE',
            templateUrl: '/app/directives/cardDisplay.html'
        };
    });

})();