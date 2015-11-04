(function () {
    'use strict';

    angular.module('app').directive('poolSummaryCharts', function () {

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

                var graphAnalysis = (function () {
                    Chart.defaults.global.animation = false;

                    var whiteColor = '#FFFFCC';
                    var blueColor = 'rgba(29,151,152,0.5)';
                    var blackColor = 'rgba(6,6,6,0.7)';
                    var redColor = 'rgba(216,90,91,0.8)';
                    var greenColor = 'rgba(74,106,41,0.8)';
                    var whiteColor_highlight = '#FFFFCC';
                    var blueColor_highlight = '#33CCFF';
                    var blackColor_highlight = 'rgba(0,0,0,0.7)';
                    var redColor_highlight = '#CC0000';
                    var greenColor_highlight = '#99FF99';

                    var cardType_creature_color = greenColor;
                    var cardType_creature_color_highlight = greenColor_highlight;
                    var cardType_sorcery_color = redColor;
                    var cardType_sorcery_color_highlight = redColor_highlight;
                    var cardType_instant_color = blueColor;
                    var cardType_instant_color_highlight = blueColor_highlight;
                    var cardType_enchantment_color = whiteColor;
                    var cardType_enchantment_color_highlight = whiteColor_highlight;
                    var cardType_land_color = '#006600';
                    var cardType_land_color_highlight = '#00CC66';
                    var cardType_planeswalker_color = '#FF0066';
                    var cardType_planeswalker_color_highlight = '#FF3399';
                    var cardType_artifact_color = blackColor;
                    var cardType_artifact_color_highlight = blackColor_highlight;

                    var barChartColor = '#dedede';
                    var highlightColor = 'rgb(51,51,51)';
                    var costBarChart_fillColor = barChartColor;
                    var costBarChart_strokeColor = barChartColor;
                    var costBarChart_highlightFill = highlightColor;
                    var costBarChart_highlightStroke = highlightColor;

                    var cardType_creature = 0;
                    var cardType_sorcery = 1;
                    var cardType_instant = 2;
                    var cardType_enchantment = 3;
                    var cardType_land = 4;
                    var cardType_planeswalker = 5;
                    var cardType_artifact = 6;

                    function GraphSetting(chartId, width, height) {
                        var self = this;
                        self.chartId = chartId;
                        self.width = width;
                        self.height = height;

                        self.$graph = null;

                        self.get$graph = function () {
                            if (self.$graph == null) {
                                self.$graph = document.getElementById(self.chartId);
                            }
                            return self.$graph;
                        }

                        self.getGraphContext = function () {
                            return self.get$graph().getContext('2d');
                        }
                    }

                    function GraphAnalysis(colorSymbolGraphSettings, manaCurveGraphSettings, cardTypesGraphSettings) {

                        var self = this;
                        self.colorSymbolGraphSettings = colorSymbolGraphSettings;
                        self.manaCurveGraphSettings = manaCurveGraphSettings;
                        self.cardTypesGraphSettings = cardTypesGraphSettings;

                        self.resetCanvas = function (graphSettings) {
                            var canvasHolder = graphSettings.getGraphContext();
                            while (canvasHolder.firstChild) {
                                canvasHolder.removeChild(canvasHolder.firstChild);
                            }
                            var canvas = document.createElement("canvas");
                            canvas.width = graphSettings.width;
                            canvas.height = graphSettings.height;
                            canvasHolder.appendChild(canvas);
                        }

                        self.resetAllCanvas = function () {
                            self.resetCanvas(self.colorSymbolGraphSettings);
                            self.resetCanvas(self.cardTypesGraphSettings);
                            self.resetCanvas(self.manaCurveGraphSettings);
                        }

                        self.collectGraphData = function (cardData) {
                            var colorInfo = [];

                            for (var i = 0; i < 5; i++) {
                                colorInfo[i] = 0;
                            }

                            var cardCosts = [];
                            var maxCardCostShown = 7;
                            for (var i = 0 ; i < maxCardCostShown + 1; i++) {
                                cardCosts[i] = 0;
                            }

                            var cardTypes = [];
                            for (var i = 0; i < 7; i++) {
                                cardTypes[i] = 0;
                            }

                            for (var i = 0; i < cardData.length; i++) {

                                var thisCardCost = cardData[i].Cost;
                                var colorlessCost = parseInt(thisCardCost.charAt(0), 10);
                                for (var j = 1; j < thisCardCost.length; j++) {
                                    switch (thisCardCost.charAt(j)) {
                                        case "W":
                                            colorInfo[0] = colorInfo[0] + 1;
                                            break;
                                        case "U":
                                            colorInfo[1] = colorInfo[1] + 1;
                                            break;
                                        case "B":
                                            colorInfo[2] = colorInfo[2] + 1;
                                            break;
                                        case "R":
                                            colorInfo[3] = colorInfo[3] + 1;
                                            break;
                                        case "G":
                                            colorInfo[4] = colorInfo[4] + 1;
                                            break;
                                        case "C":
                                            colorInfo[5] = colorInfo[5] + 1;
                                    }
                                }

                                var totalCost = colorlessCost + thisCardCost.length - 1;
                                if (totalCost < maxCardCostShown) {
                                    cardCosts[totalCost] = cardCosts[totalCost] + 1;
                                } else {
                                    cardCosts[maxCardCostShown] = cardCosts[maxCardCostShown] + 1;
                                }

                                var currentCardType = cardData[i].Type;
                                for (var k = 0; k < currentCardType.length; k++) {
                                    switch (currentCardType[k]) {
                                        case "C":
                                            cardTypes[cardType_creature] = cardTypes[cardType_creature] + 1;
                                            break;
                                        case "S":
                                            cardTypes[cardType_sorcery] = cardTypes[cardType_sorcery] + 1;
                                            break;
                                        case "I":
                                            cardTypes[cardType_instant] = cardTypes[cardType_instant] + 1;
                                            break;
                                        case "E":
                                            cardTypes[cardType_enchantment] = cardTypes[cardType_enchantment] + 1;
                                            break;
                                        case "L":
                                            cardTypes[cardType_land] = cardTypes[cardType_land] + 1;
                                            break;
                                        case "A":
                                            cardTypes[cardType_artifact] = cardTypes[cardType_artifact] + 1;
                                            break;
                                        case "P":
                                            cardTypes[cardType_planeswalker] = cardTypes[cardType_planeswalker] + 1;
                                            break;
                                    }
                                }

                            }
                            var fullInfo = {
                                colorInfo: colorInfo,
                                totalCosts: cardCosts,
                                cardTypes: cardTypes
                            };

                            return fullInfo;
                        }

                        self.displayChartsForCards = function (cardData) {
                            self.resetAllCanvas();
                            var colorData = self.collectGraphData(cardData);
                            setUpColorPieChart(colorData.colorInfo);
                            setUpManaCurveBarChart(colorData.totalCosts);
                            setUpTypeBarChart(colorData.cardTypes);
                        }



                        function setUpTypeBarChart(typeData) {
                            var data = [
                                {
                                    value: typeData[cardType_creature],
                                    color: cardType_creature_color,
                                    highlight: cardType_creature_color_highlight,
                                    label: "Creature"
                                },
                                {
                                    value: typeData[cardType_sorcery],
                                    color: cardType_sorcery_color,
                                    highlight: cardType_sorcery_color_highlight,
                                    label: "Sorcery"
                                },
                                {
                                    value: typeData[cardType_instant],
                                    color: cardType_instant_color,
                                    highlight: cardType_instant_color_highlight,
                                    label: "Instant"
                                },
                                {
                                    value: typeData[cardType_enchantment],
                                    color: cardType_enchantment_color,
                                    highlight: cardType_enchantment_color_highlight,
                                    label: "Enchantment"
                                },
                                {
                                    value: typeData[cardType_land],
                                    color: cardType_land_color,
                                    highlight: cardType_land_color_highlight,
                                    label: "Land"
                                },
                                {
                                    value: typeData[cardType_planeswalker],
                                    color: cardType_planeswalker_color,
                                    highlight: cardType_planeswalker_color_highlight,
                                    label: "Planeswalker"
                                },
                                {
                                    value: typeData[cardType_artifact],
                                    color: cardType_artifact_color,
                                    highlight: cardType_artifact_color_highlight,
                                    label: "Artifact"
                                }
                            ];
                            var myPieChart = new Chart(cardTypesSettings.getGraphContext()).Pie(data, {
                            });
                        }

                        function setUpManaCurveBarChart(manaData) {
                            var data = {
                                labels: ["0", "1", "2", "3", "4", "5", "6", "7+"],
                                datasets: [
                                    {
                                        label: "Mana Curve",
                                        fillColor: costBarChart_fillColor,
                                        strokeColor: costBarChart_strokeColor,
                                        highlightFill: costBarChart_highlightFill,
                                        highlightStroke: costBarChart_highlightStroke,
                                        data: [manaData[0], manaData[1], manaData[2], manaData[3], manaData[4], manaData[5], manaData[6], manaData[7]]
                                    }
                                ]
                            };
                            var myBarChart = new Chart(getBarChartElement()).Bar(data, {
                            });
                        }

                        function setUpColorPieChart(colorData) {
                            var data = [
                                {
                                    value: colorData[0],
                                    color: whiteColor,
                                    highlight: whiteColor_highlight,
                                    label: "White"
                                },
                                {
                                    value: colorData[1],
                                    color: blueColor,
                                    highlight: blueColor_highlight,
                                    label: "Blue"
                                },
                                {
                                    value: colorData[2],
                                    color: blackColor,
                                    highlight: blackColor_highlight,
                                    label: "Black"
                                },
                                {
                                    value: colorData[3],
                                    color: redColor,
                                    highlight: redColor_highlight,
                                    label: "Red"
                                },
                                {
                                    value: colorData[4],
                                    color: greenColor,
                                    highlight: greenColor_highlight,
                                    label: "Green"
                                }
                            ];
                            var myPieChart = new Chart(getPieChartElement()).Pie(data, {
                            });
                        }

                    }


                    return {
                        GraphSetting: GraphSetting,
                        GraphAnalysis: GraphAnalysis
                    };
                })();


                var graphWidth = 200;
                var graphHeight = 200;
                $scope.fixedCharts = false;

                

                $scope.hideCharts = function () {
                    $scope.chartsHidden = true;
                    trackEvent($scope.controllerId, 'toggle-charts');
                };

                var topCharts = new graphAnalysis.GraphAnalysis(
                        new graphAnalysis.GraphSetting('colorPieChartsContainer', graphWidth, graphHeight),
                        new graphAnalysis.GraphSetting('manaCurveBarChartContainer', graphWidth, graphHeight),
                        new graphAnalysis.GraphSetting('typePieChartContainer', graphWidth, graphHeight)
                    );
                $scope.$watch(function () {
                    return $scope.topGraphCards;
                }, function (newVal, oldVal) {
                    topCharts.resetAllCanvas();
                    topCharts.displayChartsForCards($scope.topGraphCards);
                }, true);

                if ($scope.bottomGraphCards != null) {
                    var bottomCharts = new graphAnalysis.GraphAnalysis(
                        new graphAnalysis.GraphSetting('colorPieChartsContainer-bottom', graphWidth, graphHeight),
                        new graphAnalysis.GraphSetting('manaCurveBarChartContainer-bottom', graphWidth, graphHeight),
                        new graphAnalysis.GraphSetting('typePieChartContainer-bottom', graphWidth, graphHeight)
                    );

                    $scope.$watch(function () {
                        return $scope.bottomGraphCards;
                    }, function (newVal, oldVal) {
                        bottomCharts.resetAllCanvas();
                        bottomCharts.displayChartsForCards($scope.topGraphCards);
                    }, true);

                }

            }
        }

    });

})();