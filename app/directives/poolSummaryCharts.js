(function () {
    'use strict';

    angular.module('app').directive('poolSummaryCharts', ['graphAnalysis', function (graphAnalysis) {

        return {
            scope: {
                topCardStatsTitle: '=',
                topGraphCards: '=',
                bottomCardStatsTitle: '=',
                bottomGraphCards: '=',
                chartsHidden: '=',
                controllerId: '='
            },
            restrict: 'AE',
            templateUrl: '/app/directives/poolSummaryCharts.html',
            controller: function ($scope, $element) {
                var graphWidth = 200;
                var graphHeight = 200;
                $scope.fixedCharts = false;

                $scope.hideCharts = function () {
                    $scope.chartsHidden = true;
                    trackEvent($scope.controllerId, 'toggle-charts');
                };

                $scope.$watch(function () {
                    return $scope.topGraphCards;
                }, function (newVal, oldVal) {
                    graphAnalysis.resetAllCanvas();
                    graphAnalysis.setPieChartGraphElement('colorPieChartContainer', graphWidth, graphHeight);
                    graphAnalysis.setBarChartGraphElement('manaCurveBarChartContainer', graphWidth, graphHeight);
                    graphAnalysis.setTypeChartHolder('typePieChartContainer', graphWidth, graphHeight);
                    graphAnalysis.displayChartsForCards($scope.topGraphCards);
                }, true);

                if ($scope.bottomGraphCards != null) {

                    $scope.$watch(function () {
                        return $scope.bottomGraphCards;
                    }, function (newVal, oldVal) {
                        graphAnalysis.resetAllCanvas();
                        graphAnalysis.setPieChartGraphElement('colorPieChartContainer-bottom', graphWidth, graphHeight);
                        graphAnalysis.setBarChartGraphElement('manaCurveBarChartContainer-bottom', graphWidth, graphHeight);
                        graphAnalysis.setTypeChartHolder('typePieChartContainer-bottom', graphWidth, graphHeight);
                        graphAnalysis.displayChartsForCards($scope.bottomGraphCards);
                    }, true);

                }

            }
        }

    }]);

})();