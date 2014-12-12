(function () {
    'use strict';
    var controllerId = 'draftsim';
    angular.module('app').controller(controllerId, ['common', 'datacontext', 'downloadDataService', 'graphAnalysis', 'landcards', '$modal', draftsim]);

    function draftsim(common, datacontext, downloadDataService, graphAnalysis, landcards, $modal) {
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);
        var logSuccess = common.logger.getLogFn(controllerId, 'success');
        var logError = common.logger.getLogFn(controllerId, 'error');

        var vm = this;




        vm.title = 'Sealed Simulator';
        vm.column1Title = "Image";
        vm.column2Title = "Name";
        vm.column3Title = "Rarity";

        vm.boosters_to_open = 1;

        vm.boosters_to_open_ktk = 3;
        vm.boosters_to_open_core = 0;
        vm.boosters_to_open_jou = 0;
        vm.boosters_to_open_bng = 0;
        vm.boosters_to_open_ths = 0;

        vm.boosterCards = [];

        vm.selectedCards = [];
        vm.deckCards = [];
        
        vm.draftFinished = false;
        vm.draftStarted = false;
        vm.packsOpened = 0;
        vm.totalPacksToOpen = 3;

        vm.fixedKTKPacks = 0;
        vm.fixedCorePacks = 0;
        vm.fixedJOUpacks = 0;
        vm.fixedBNGpacks = 0;
        vm.fixedTHSpacks = 0;

        vm.landcards = [];
        vm.selectedLandCards = [];

        var startingTopPanelCardsTitle = "Booster Cards";
        vm.topPanelCardsTitle = startingTopPanelCardsTitle;
        var startingCardsStatsTitle = "Selected Cards Stats";
        vm.cardStatsTitle = startingCardsStatsTitle;

        vm.showExtraOptions = false;
        vm.displayExtraOptions = function () {
            if (vm.showExtraOptions) {
                vm.showExtraOptions = false;
            } else {
                vm.showExtraOptions = true;
            }
        }

        vm.downloadFullPool = function () {
            downloadDataService.saveCardsList(vm.selectedCards.concat(vm.deckCards), "MyDraftPool");
        }
        vm.downloadDraftDeck = function () {
            downloadDataService.saveCardsList(vm.deckCards.concat(vm.selectedLandCards), "MyDeckSelection");
        }

        vm.addToDeck = function(card)
        {
            _removeFromArrayAndAddToArray(vm.boosterCards, vm.selectedCards, card);
            logSuccess("You've chosen " + card.Name + "!");
            takeTurn();

            if (vm.boosterCards.length == 0) {
                if (vm.packsOpened < vm.totalPacksToOpen) {
                    vm.openNextPack();
                } else {
                    vm.draftFinished = true;
                    vm.topPanelCardsTitle = "Deck Cards";
                }
            }

            graphAnalysis.displayChartsForCards(vm.selectedCards);
        };

        vm.cardPoolClick = function (card) {
            if (vm.draftFinished) {
                _removeFromArrayAndAddToArray(vm.selectedCards, vm.deckCards, card);
                vm.cardStatsTitle = "My Deck Stats";
                graphAnalysis.displayChartsForCards(vm.deckCards);
            }
        }
        vm.deckCardClick = function (card) {
            if (vm.draftFinished) {
                _removeFromArrayAndAddToArray(vm.deckCards, vm.selectedCards, card);
                graphAnalysis.displayChartsForCards(vm.deckCards);
            }
        }

        vm.landCardClick = function (card) {
            if (vm.draftFinished) {
                vm.selectedLandCards.push(card);
            }
        }
        vm.removeLandCard = function (card) {
            var index = vm.selectedLandCards.indexOf(card);
            if (index > -1) {
                vm.selectedLandCards.splice(index, 1);
            }
        }

        vm.removeFromDeck = function(card)
        {
            _removeFromArrayAndAddToArray(vm.selectedCards, vm.boosterCards, card);
        }

        function _removeFromArrayAndAddToArray(arrayToRemoveFrom, arrayToAddTo, card)
        {
            var index = arrayToRemoveFrom.indexOf(card);
            if (index > -1) {
                arrayToRemoveFrom.splice(index, 1);
            }
            arrayToAddTo.push(card);
        }

        vm.openBoosters = function()
        {
            return datacontext.openSortedBoosters(vm.boosters_to_open).then(function (data) {
                log("Opened " + vm.boosters_to_open + " booster packs.");
                vm.boosterCards.push.apply(vm.boosterCards, data.mythicCards);
                vm.boosterCards.push.apply(vm.boosterCards, data.rareCards);
                vm.boosterCards.push.apply(vm.boosterCards, data.uncommonCards);
                vm.boosterCards.push.apply(vm.boosterCards, data.commonCards);
                return vm.boosterCards;
            });
        };

        vm.openNextPack = function ()
        {
            log("Opening a new pack...");
            vm.packsOpened++;
            for (var i = 0; i < vm.numberOfPlayers; i++) {
                openAIBooster(vm.AIs[i]);
            }
            vm.boosterCards = vm.AIs[0].boosterCards;
            log("Packs opened: " + vm.packsOpened + " Total packs to open: " + vm.totalPacksToOpen);
        }

        activate();

        function activate() {
            common.activateController([], controllerId)
                .then(function () {
                    vm.landcards = landcards.getLandCards();
                    var graphWidth = 200;
                    var graphHeight = 200;
                    graphAnalysis.setPieChartGraphElement('colorPieChartContainer', graphWidth, graphHeight);
                    graphAnalysis.setBarChartGraphElement('manaCurveBarChartContainer', graphWidth, graphHeight);
                    graphAnalysis.setTypeChartHolder('typePieChartContainer', graphWidth, graphHeight);
                });
        };

        
        vm.numberOfPlayers = 8;
        vm.AIs = [];

        function validateEntries() {
            if (vm.boosters_to_open_core == null
                || vm.boosters_to_open_ths == null
                || vm.boosters_to_open_bng == null
                || vm.boosters_to_open_jou == null
                || vm.boosters_to_open_ktk == null) {
                logError("Please use a number for the amount of boosters.");
                return false;
            }
            return true;
        }

        vm.startDraft = function () {
            if (!validateEntries()) {
                return false;
            }
            vm.draftStarted = true;
            vm.draftFinished = false;
            vm.topPanelCardsTitle = startingTopPanelCardsTitle;
            vm.cardStatsTitle = startingCardsStatsTitle;

            graphAnalysis.resetAllCanvas();
            //Clear the current boosters and selected cards.
            vm.boosterCards = [];
            vm.selectedCards = [];
            vm.deckCards = [];
            vm.selectedLandCards = [];
            vm.fixedKTKPacks = parseInt(vm.boosters_to_open_ktk);
            vm.fixedCorePacks = parseInt(vm.boosters_to_open_core);
            vm.fixedBNGpacks = parseInt(vm.boosters_to_open_bng);
            vm.fixedTHSpacks = parseInt(vm.boosters_to_open_ths);
            vm.fixedJOUpacks = parseInt(vm.boosters_to_open_jou);
            vm.totalPacksToOpen = vm.fixedBNGpacks + vm.fixedTHSpacks + vm.fixedJOUpacks + vm.fixedCorePacks + vm.fixedKTKPacks;
            vm.packsOpened = 1;
            //Open the first booster pack.
            setUpAIs();
            //Set player to vm.
            vm.boosterCards = vm.AIs[0].boosterCards;
            log("You've started a new draft");
        };



        vm.openHandSimulator = function () {
            var allSelectedCards = vm.deckCards.concat(vm.selectedLandCards);
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
                log("Please add some cards to your deck (click on them below).");
            }

        };

        function takeTurn()
        {
            for (var i = 1; i < vm.AIs.length; i++)
            {
                processTurn(vm.AIs[i]);
            }

            var boosterPacks = [];
            for (var i = 0; i < vm.AIs.length; i++) {
                boosterPacks.push(vm.AIs[i].boosterCards);
            }
            //Give pack 8 to player 0.
            vm.AIs[0].boosterCards = boosterPacks[vm.AIs.length - 1];
            vm.boosterCards = vm.AIs[0].boosterCards;
            for (var i = 1; i < vm.AIs.length; i++)
            {
                vm.AIs[i].boosterCards = boosterPacks[i - 1];
            }
        }

        function setUpAIs() {
            //Player 0 is the human.
            vm.AIs = [];
            for (var i = 0; i < vm.numberOfPlayers; i++) {
                var player = new ai(i);
                openAIBooster(player);
                vm.AIs.push(player);

            }
        }

        function openAIBooster(ai)
        {
            if (vm.packsOpened <= vm.fixedKTKPacks) {
                return datacontext.openMixtureOfSortedBoosters(0, 0, 0, 0, 1).then(function (data) {
                    ai.boosterCards.push.apply(ai.boosterCards, data.mythicCards);
                    ai.boosterCards.push.apply(ai.boosterCards, data.rareCards);
                    ai.boosterCards.push.apply(ai.boosterCards, data.uncommonCards);
                    ai.boosterCards.push.apply(ai.boosterCards, data.commonCards);
                    return ai.boosterCards;
                });
            }

            if (vm.packsOpened <= vm.fixedCorePacks + vm.fixedKTKPacks)
            {
                return datacontext.openMixtureOfSortedBoosters(0, 0, 0, 1, 0).then(function (data) {
                    ai.boosterCards.push.apply(ai.boosterCards, data.mythicCards);
                    ai.boosterCards.push.apply(ai.boosterCards, data.rareCards);
                    ai.boosterCards.push.apply(ai.boosterCards, data.uncommonCards);
                    ai.boosterCards.push.apply(ai.boosterCards, data.commonCards);
                    return ai.boosterCards;
                });
            }
            if (vm.packsOpened <= vm.fixedJOUpacks + vm.fixedCorePacks + vm.fixedKTKPacks)
            {
                return datacontext.openMixtureOfSortedBoosters(0, 0, 1, 0, 0).then(function (data) {
                    ai.boosterCards.push.apply(ai.boosterCards, data.mythicCards);
                    ai.boosterCards.push.apply(ai.boosterCards, data.rareCards);
                    ai.boosterCards.push.apply(ai.boosterCards, data.uncommonCards);
                    ai.boosterCards.push.apply(ai.boosterCards, data.commonCards);
                    return ai.boosterCards;
                });
            }
            else if (vm.packsOpened <= vm.fixedBNGpacks + vm.fixedJOUpacks + vm.fixedCorePacks + vm.fixedKTKPacks)
            {
                return datacontext.openSortedBoosters(1).then(function (data) {
                    ai.boosterCards.push.apply(ai.boosterCards, data.mythicCards);
                    ai.boosterCards.push.apply(ai.boosterCards, data.rareCards);
                    ai.boosterCards.push.apply(ai.boosterCards, data.uncommonCards);
                    ai.boosterCards.push.apply(ai.boosterCards, data.commonCards);
                    return ai.boosterCards;
                });
            } else {
                return datacontext.openMixtureOfSortedBoosters(1, 0, 0, 0, 0).then(function (data) {
                    ai.boosterCards.push.apply(ai.boosterCards, data.mythicCards);
                    ai.boosterCards.push.apply(ai.boosterCards, data.rareCards);
                    ai.boosterCards.push.apply(ai.boosterCards, data.uncommonCards);
                    ai.boosterCards.push.apply(ai.boosterCards, data.commonCards);
                    return ai.boosterCards;
                });
            }
        }
    }
})();