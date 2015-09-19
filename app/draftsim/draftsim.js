(function () {
    'use strict';
    var controllerId = 'draftsim';
    angular.module('app').controller(controllerId, ['common', 'datacontext', 'downloadDataService', 'graphAnalysis', 'landcards', '$modal', 'webapicontext', 'ai', draftsim]);

    function draftsim(common, datacontext, downloadDataService, graphAnalysis, landcards, $modal, webapicontext, ai) {
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

        vm.boosterCards = [];

        vm.selectedCards = [];
        vm.deckCards = [];
        
        vm.draftFinished = false;
        vm.draftStarted = false;
        vm.packsOpened = 0;
        vm.totalPacksToOpen = 3;

        vm.landcards = [];
        vm.selectedLandCards = [];

        var startingTopPanelCardsTitle = "Booster Cards";
        vm.topPanelCardsTitle = startingTopPanelCardsTitle;
        var startingCardsStatsTitle = "Selected Cards Stats";
        vm.cardStatsTitle = startingCardsStatsTitle;


        vm.setGroups = [];
        vm.fixedSetGroups = [];
        function initSetGroups() {
            datacontext.getCardSetGroups().then(function (data) {
                data[0][0].boostersToOpen = 3; //Set latest set to open 6 boosters by default
                vm.setGroups = data;
                trackEvent(controllerId, 'init');
            });
        }


        vm.chartsHidden = false;
        vm.hideCharts = function () {
            vm.chartsHidden = !vm.chartsHidden;
            trackEvent(controllerId, 'toggle-charts');
        }

        vm.showExtraOptions = false;
        vm.displayExtraOptions = function () {
            if (vm.showExtraOptions) {
                vm.showExtraOptions = false;
                trackEvent(controllerId, 'hide-extra-options');
            } else {
                vm.showExtraOptions = true;
                trackEvent(controllerId, 'show-extra-options');
            }
        }

        vm.downloadFullPool = function () {
            downloadDataService.saveCardsList(vm.selectedCards.concat(vm.deckCards), "MyDraftPool");
            trackEvent(controllerId, 'download-full-pool');
        }
        vm.downloadDraftDeck = function () {
            downloadDataService.saveCardsList(vm.deckCards.concat(vm.selectedLandCards), "MyDeckSelection");
            trackEvent(controllerId, 'download-selected-pool');
        }

        vm.addToDeck = function(card)
        {
            _removeFromArrayAndAddToArray(vm.boosterCards, vm.selectedCards, card);
            logSuccess("You've chosen " + card.Name + "!");
            takeTurn();

            trackEvent(controllerId, 'card-picked', card.Name);

            if (vm.boosterCards.length == 0) {
                if (vm.packsOpened < vm.totalPacksToOpen) {
                    vm.openNextPack();
                } else {
                    vm.draftFinished = true;
                    vm.topPanelCardsTitle = "Deck Cards";
                    trackEvent(controllerId, 'finished-draft');
                }
            }

            graphAnalysis.displayChartsForCards(vm.selectedCards);
        };

        vm.cardPoolClick = function (card) {
            if (vm.draftFinished) {
                _removeFromArrayAndAddToArray(vm.selectedCards, vm.deckCards, card);
                vm.cardStatsTitle = "My Deck Stats";
                graphAnalysis.displayChartsForCards(vm.deckCards);
                trackEvent(controllerId, 'removed-card-from-selection', card.Name);
            }
        }
        vm.deckCardClick = function (card) {
            if (vm.draftFinished) {
                _removeFromArrayAndAddToArray(vm.deckCards, vm.selectedCards, card);
                graphAnalysis.displayChartsForCards(vm.deckCards);
                trackEvent(controllerId, 'added-card-to-selection', card.Name);
            }
        }

        vm.landCardClick = function (card) {
            if (vm.draftFinished) {
                vm.selectedLandCards.push(card);
                trackEvent(controllerId, 'added-land-card', card.Name);
            }
        }
        vm.removeLandCard = function (card) {
            var index = vm.selectedLandCards.indexOf(card);
            if (index > -1) {
                vm.selectedLandCards.splice(index, 1);
                trackEvent(controllerId, 'removed-land-card', card.Name);
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
            openBoosterForEachPlayer();
            vm.boosterCards = vm.AIs[0].boosterCards;
            log("Packs opened: " + vm.packsOpened + " Total packs to open: " + vm.totalPacksToOpen);
        }

        activate();

        function activate() {
            common.activateController([initSetGroups()], controllerId)
                .then(function () {
                    vm.landcards = landcards.getLandCards();
                    var graphWidth = 200;
                    var graphHeight = 200;
                    graphAnalysis.setPieChartGraphElement('colorPieChartContainer', graphWidth, graphHeight);
                    graphAnalysis.setBarChartGraphElement('manaCurveBarChartContainer', graphWidth, graphHeight);
                    graphAnalysis.setTypeChartHolder('typePieChartContainer', graphWidth, graphHeight);
                    graphAnalysis.resetAllCanvas();
                });
        };

        
        vm.numberOfPlayers = 8;
        vm.AIs = [];


        vm.startDraft = function () {

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

            vm.fixedSetGroups = datacontext.copyCardSetGroup(vm.setGroups);

            var totalPacks = 0;
            for (var i = 0; i < vm.fixedSetGroups.length; i++) {
                var group = vm.fixedSetGroups[i];
                for (var k = 0; k < group.length; k++) {
                    totalPacks += group[k].boostersToOpen;
                }
            }
            vm.totalPacksToOpen = totalPacks;

            vm.packsOpened = 1;
            //Open the first booster pack.
            setUpAIs();
            //Set player to vm.
            vm.boosterCards = vm.AIs[0].boosterCards;
            log("You've started a new draft");

            trackEvent(controllerId, 'start-draft');
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
            trackEvent(controllerId, 'opened-hand-simulator');
        };

        function takeTurn()
        {
            for (var i = 1; i < vm.AIs.length; i++)
            {
                vm.AIs[i].processTurn();
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
                var player = new ai.AI(i);
                vm.AIs.push(player);
            }
            openBoosterForEachPlayer();
        }

        function openBoosterForEachPlayer() {

            var setToOpen = getNextBoosterSetToOpen();
            var totalBoostersForSet = setToOpen.boostersToOpen;
            setToOpen.boostersToOpen = 1;
            for (var i = 0; i < vm.numberOfPlayers; i++) {
                var boosterCards = datacontext.openBoosterForCardSet(setToOpen);
                addAICards(vm.AIs[i], boosterCards);
            }
            setToOpen.boostersToOpen = totalBoostersForSet - 1;

        }

        function getNextBoosterSetToOpen() {
            for (var groupNumber = 0; groupNumber < vm.fixedSetGroups.length; groupNumber++) {
                var group = vm.fixedSetGroups[groupNumber];

                for (var setNumber = 0; setNumber < group.length; setNumber++) {
                    var currentSet = group[setNumber];
                    if (currentSet.boostersToOpen > 0) {
                        return currentSet;
                    }
                }
            }
        }

        function addAICards(ai, cardData) {
            ai.boosterCards.push.apply(ai.boosterCards, cardData.mythicCards);
            ai.boosterCards.push.apply(ai.boosterCards, cardData.rareCards);
            ai.boosterCards.push.apply(ai.boosterCards, cardData.uncommonCards);
            ai.boosterCards.push.apply(ai.boosterCards, cardData.commonCards);
            return ai.boosterCards;
        }
    }
})();