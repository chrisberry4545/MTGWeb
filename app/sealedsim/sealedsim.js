(function () {
    'use strict';
    var controllerId = 'sealedsim';
    angular.module('app').controller(controllerId, ['common', 'datacontext', 'downloadDataService', 'graphAnalysis', 'landcards', '$modal', '$scope', sealedsim]);

    function sealedsim(common, datacontext, downloadDataService, graphAnalysis, landcards, $modal, $scope) {
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);
        var logSuccess = common.logger.getLogFn(controllerId, 'success');
        var logError = common.logger.getLogFn(controllerId, 'error');

        var graphWidth = 200;
        var graphHeight = 200;

        var vm = this;
        vm.title = 'Sealed Simulator';
        vm.boosters_to_open_bfz = 6;
        vm.boosters_to_open_ori = 0;
        vm.boosters_to_open_mm2 = 0;
        vm.boosters_to_open_dtk = 0;
        vm.boosters_to_open_frf = 0;
        vm.boosters_to_open_ktk = 0;
        vm.boosters_to_open_core = 0;
        vm.boosters_to_open_jou = 0;
        vm.boosters_to_open_bng = 0;
        vm.boosters_to_open_ths = 0;

        vm.landcards = [];
        vm.selectedLandCards = [];

        vm.showOldSets = false;
        vm.includeOlderSets = function () {
            if (vm.showOldSets) {
                vm.showOldSets = false;
            } else {
                vm.showOldSets = true;
            }
        }

        vm.chartsHidden = false;
        vm.hideCharts = function () {
            vm.chartsHidden = !vm.chartsHidden;
        }

        vm.include_seeded_boosters = "0";
        vm.include_seeded_boosters_options = [
            //{ key: "W", value: "White" },
            //{ key: "U", value: "Blue" },
            //{ key: "B", value: "Black" },
            //{ key: "R", value: "Red" },
            //{ key: "G", value: "Green" },
            { key: "0", value: "Don't use Seeded" }
        ];


        vm.additionalSealedPacks = [];

        vm.removeSealedPack = function () {
            vm.additionalSealedPacks.pop();
        }

        vm.addSeededPack = function () {
            vm.additionalSealedPacks.push(vm.include_seeded_boosters);
        }

        vm.boosterCards = [];

        vm.selectedCards = [];

        vm.saveSelection = function () {
            downloadDataService.saveCardsList(vm.selectedCards.concat(vm.selectedLandCards), "sealedselection");
        }
        vm.saveCardsInBooster = function () {
            downloadDataService.saveCardsList(vm.boosterCards, "cardsRemainingInPool");
        }
        vm.saveCompletePool = function () {
            downloadDataService.saveCardsList(vm.selectedCards.concat(vm.boosterCards), "sealedPool");
        }

        vm.addLandCard = function (card) {
            vm.selectedLandCards.push(card);
        }
        vm.removeLandCard = function (card) {
            var index = vm.selectedLandCards.indexOf(card);
            if (index > -1) {
                vm.selectedLandCards.splice(index, 1);
            }
        }

        vm.addToDeck = function(card)
        {
            logSuccess("Added " + card.Name + " to your selection...");
            _removeFromArrayAndAddToArray(vm.boosterCards, vm.selectedCards, card);
            graphAnalysis.displayChartsForCards(vm.selectedCards);
        };

        vm.removeFromDeck = function(card)
        {
            log("Put " + card.Name + " back into sealed pool...")
            _removeFromArrayAndAddToArray(vm.selectedCards, vm.boosterCards, card);
            graphAnalysis.displayChartsForCards(vm.selectedCards);
        }


        vm.openHandSimulator = function () {
            var allSelectedCards = vm.selectedCards.concat(vm.selectedLandCards);
            if (allSelectedCards.length > 0) {
                var modalInstance = $modal.open({
                    templateUrl: 'handmodal.html',
                    controller: 'handmodal',
                    resolve: {
                        fullDeck: function () {
                            return allSelectedCards;
                        }
                    }
                });
            } else {
                log("Please add some cards to your deck (click on them above).");
            }

        };

        function _removeFromArrayAndAddToArray(arrayToRemoveFrom, arrayToAddTo, card)
        {
            var index = arrayToRemoveFrom.indexOf(card);
            if (index > -1) {
                arrayToRemoveFrom.splice(index, 1);
            }
            arrayToAddTo.push(card);
        }

        function validateEntries() {

            if (vm.boosters_to_open_core == null
                || vm.boosters_to_open_ths == null
                || vm.boosters_to_open_bng == null
                || vm.boosters_to_open_jou == null
                || vm.boosters_to_open_ktk == null
                || vm.boosters_to_open_frf == null
                || vm.boosters_to_open_dtk == null
                || vm.boosters_to_open_mm2 == null
                || vm.boosters_to_open_ori == null
                || vm.boosters_to_open_bfz == null) {
                logError("Please use a number for the amount of boosters.");
                return false;
            }
            return true;
        }

        vm.openBoosters = function()
        {
            if (!validateEntries()) {
                return false;
            }
            if (vm.include_seeded_boosters != "0") {
                    return datacontext.openMixtureOfSeededBoosters(
                        parseInt(vm.boosters_to_open_ths),
                        parseInt(vm.boosters_to_open_bng),
                        parseInt(vm.boosters_to_open_jou),
                        parseInt(vm.boosters_to_open_core),
                        parseInt(vm.boosters_to_open_ktk),
                        parseInt(vm.boosters_to_open_frf),
                        parseInt(vm.boosters_to_open_dtk),
                        parseInt(vm.boosters_to_open_mm2),
                        parseInt(vm.boosters_to_open_ori),
                        parseInt(vm.boosters_to_open_bfz),
                        vm.include_seeded_boosters).then(function (data) {
                            vm.boosterCards = [];
                            vm.selectedCards = [];
                            vm.selectedLandCards = [];

                            var additionalMythic = [];
                            var additionalRare = [];
                            var additionalUncommon = [];
                            var additionalCommon = [];
                            for (var i = 0; i < vm.additionalSealedPacks.length; i++) {
                                var additionalSeeded = vm.additionalSealedPacks[i];
                                if (additionalSeeded != "0") {
                                    var additionalCards = datacontext.openXCardBoostersForLatestSet(1, additionalSeeded);
                                    additionalMythic.push.apply(additionalMythic, additionalCards.mythicCards);
                                    additionalRare.push.apply(additionalRare, additionalCards.rareCards);
                                    additionalUncommon.push.apply(additionalUncommon, additionalCards.uncommonCards);
                                    additionalCommon.push.apply(additionalCommon, additionalCards.commonCards);
                                }
                            }


                            vm.boosterCards.push.apply(vm.boosterCards, additionalMythic);
                            vm.boosterCards.push.apply(vm.boosterCards, data.mythicCards);
                            vm.boosterCards.push.apply(vm.boosterCards, additionalRare);
                            vm.boosterCards.push.apply(vm.boosterCards, data.rareCards);
                            vm.boosterCards.push.apply(vm.boosterCards, additionalUncommon);
                            vm.boosterCards.push.apply(vm.boosterCards, data.uncommonCards);
                            vm.boosterCards.push.apply(vm.boosterCards, additionalCommon);
                            vm.boosterCards.push.apply(vm.boosterCards, data.commonCards);

                            graphAnalysis.resetAllCanvas();
                            graphAnalysis.setPieChartGraphElement('colorPieChartContainer-cardPool', graphWidth, graphHeight);
                            graphAnalysis.setBarChartGraphElement('manaCurveBarChartContainer-cardPool', graphWidth, graphHeight);
                            graphAnalysis.setTypeChartHolder('typePieChartContainer-cardPool', graphWidth, graphHeight);
                            graphAnalysis.displayChartsForCards(vm.boosterCards);
                            graphAnalysis.setPieChartGraphElement('colorPieChartContainer-selectedCards', graphWidth, graphHeight);
                            graphAnalysis.setBarChartGraphElement('manaCurveBarChartContainer-selectedCards', graphWidth, graphHeight);
                            graphAnalysis.setTypeChartHolder('typePieChartContainer-selectedCards', graphWidth, graphHeight);

                            return vm.boosterCards;
                        });
            } else {
                return datacontext.openMixtureOfSortedBoosters(
                    parseInt(vm.boosters_to_open_ths),
                    parseInt(vm.boosters_to_open_bng),
                    parseInt(vm.boosters_to_open_jou),
                    parseInt(vm.boosters_to_open_core),
                    parseInt(vm.boosters_to_open_ktk),
                    parseInt(vm.boosters_to_open_frf),
                    parseInt(vm.boosters_to_open_dtk),
                    parseInt(vm.boosters_to_open_mm2),
                    parseInt(vm.boosters_to_open_ori),
                    parseInt(vm.boosters_to_open_bfz)
                    ).then(function (data) {
                        vm.boosterCards = [];
                        vm.selectedCards = [];
                        vm.boosterCards.push.apply(vm.boosterCards, data.mythicCards);
                        vm.boosterCards.push.apply(vm.boosterCards, data.rareCards);
                        vm.boosterCards.push.apply(vm.boosterCards, data.uncommonCards);
                        vm.boosterCards.push.apply(vm.boosterCards, data.commonCards);

                        graphAnalysis.setPieChartGraphElement('colorPieChartContainer-cardPool', graphWidth, graphHeight);
                        graphAnalysis.setBarChartGraphElement('manaCurveBarChartContainer-cardPool', graphWidth, graphHeight);
                        graphAnalysis.setTypeChartHolder('typePieChartContainer-cardPool', graphWidth, graphHeight);
                        graphAnalysis.displayChartsForCards(vm.boosterCards);
                        graphAnalysis.setPieChartGraphElement('colorPieChartContainer-selectedCards', graphWidth, graphHeight);
                        graphAnalysis.setBarChartGraphElement('manaCurveBarChartContainer-selectedCards', graphWidth, graphHeight);
                        graphAnalysis.setTypeChartHolder('typePieChartContainer-selectedCards', graphWidth, graphHeight);

                        return vm.boosterCards;
                    });
            }
        };

        activate();

        function activate() {
            common.activateController([], controllerId)
                .then(function () {
                    vm.landcards = landcards.getLandCards();
                    graphAnalysis.setPieChartGraphElement('colorPieChartContainer', graphWidth, graphHeight);
                    graphAnalysis.setBarChartGraphElement('manaCurveBarChartContainer', graphWidth, graphHeight);
                    graphAnalysis.setTypeChartHolder('typePieChartContainer', graphWidth, graphHeight);
                    graphAnalysis.resetAllCanvas();
                });
        };
    }
})();