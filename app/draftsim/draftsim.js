(function () {
    'use strict';
    var controllerId = 'draftsim';
    angular.module('app').controller(controllerId, ['common', 'datacontext', 'downloadDataService', 'graphAnalysis', 'landcards', '$modal', 'webapicontext', draftsim]);

    function draftsim(common, datacontext, downloadDataService, graphAnalysis, landcards, $modal, webapicontext) {
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

        vm.boosters_to_open_bfz = 3;
        vm.boosters_to_open_ori = 0;
        vm.boosters_to_open_mm2 = 0;
        vm.boosters_to_open_dtk = 0;
        vm.boosters_to_open_frf = 0;
        vm.boosters_to_open_ktk = 0;
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

        vm.fixedBFZpacks = 0;
        vm.fixedORIpacks = 0;
        vm.fixedMM2Packs = 0;
        vm.fixedDTKpacks = 0;
        vm.fixedFRFPacks = 0;
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


        vm.chartsHidden = false;
        vm.hideCharts = function () {
            vm.chartsHidden = !vm.chartsHidden;
        }

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
            webapicontext.postCardSelected(card.Number, card.Set, vm.boosterCards.length);
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
                    graphAnalysis.resetAllCanvas();
                });
        };

        
        vm.numberOfPlayers = 8;
        vm.AIs = [];

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
            vm.fixedBFZpacks = parseInt(vm.boosters_to_open_bfz);
            vm.fixedORIpacks = parseInt(vm.boosters_to_open_ori);
            vm.fixedMM2Packs = parseInt(vm.boosters_to_open_mm2);
            vm.fixedDTKpacks = parseInt(vm.boosters_to_open_dtk);
            vm.fixedFRFPacks = parseInt(vm.boosters_to_open_frf);
            vm.fixedKTKPacks = parseInt(vm.boosters_to_open_ktk);
            vm.fixedCorePacks = parseInt(vm.boosters_to_open_core);
            vm.fixedBNGpacks = parseInt(vm.boosters_to_open_bng);
            vm.fixedTHSpacks = parseInt(vm.boosters_to_open_ths);
            vm.fixedJOUpacks = parseInt(vm.boosters_to_open_jou);
            vm.totalPacksToOpen = vm.fixedBNGpacks + vm.fixedTHSpacks + vm.fixedJOUpacks + vm.fixedCorePacks + vm.fixedKTKPacks + vm.fixedFRFPacks + vm.fixedDTKpacks + vm.fixedMM2Packs + vm.fixedORIpacks + vm.fixedBFZpacks;
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
            var totalPacksOpened = vm.fixedBFZpacks;
            if (vm.packsOpened <= totalPacksOpened) {
                return datacontext.openMixtureOfSortedBoosters(0, 0, 0, 0, 0, 0, 0, 0, 0, 1).then(function (data) {
                    return addAICards(ai, data);
                });
            }
            
            totalPacksOpened += vm.fixedORIpacks;
            if (vm.packsOpened <= totalPacksOpened) {
                return datacontext.openMixtureOfSortedBoosters(0, 0, 0, 0, 0, 0, 0, 0, 1, 0).then(function (data) {
                    return addAICards(ai, data);
                });
            }

            totalPacksOpened += vm.fixedMM2Packs;
            if (vm.packsOpened <= totalPacksOpened) {
                return datacontext.openMixtureOfSortedBoosters(0, 0, 0, 0, 0, 0, 0, 1, 0, 0).then(function (data) {
                    return addAICards(ai, data);
                });
            }

            totalPacksOpened += vm.fixedDTKpacks;
            if (vm.packsOpened <= totalPacksOpened) {
                return datacontext.openMixtureOfSortedBoosters(0, 0, 0, 0, 0, 0, 1, 0, 0, 0).then(function(data) {
                    return addAICards(ai, data);
                });
            }

            totalPacksOpened += vm.fixedFRFPacks;
            if (vm.packsOpened <= totalPacksOpened) {
                return datacontext.openMixtureOfSortedBoosters(0, 0, 0, 0, 0, 1, 0, 0, 0, 0).then(function (data) {
                    return addAICards(ai, data);
                });
            }

            totalPacksOpened += vm.fixedKTKPacks;
            if (vm.packsOpened <= totalPacksOpened)
            {
                return datacontext.openMixtureOfSortedBoosters(0, 0, 0, 0, 1, 0, 0, 0, 0, 0).then(function (data) {
                    return addAICards(ai, data);
                });
            }

            totalPacksOpened += vm.fixedCorePacks;
            if (vm.packsOpened <= totalPacksOpened)
            {
                return datacontext.openMixtureOfSortedBoosters(0, 0, 0, 1, 0, 0, 0, 0, 0, 0).then(function (data) {
                    return addAICards(ai, data);
                });
            }

            totalPacksOpened += vm.fixedJOUpacks;
            if (vm.packsOpened <= totalPacksOpened)
            {
                return datacontext.openMixtureOfSortedBoosters(0,0,1,0,0,0,0,0,0,0).then(function (data) {
                    return addAICards(ai, data);
                });
            }

            totalPacksOpened += vm.fixedBNGpacks;
            if (vm.packsOpened <= totalPacksOpened)
            {
                return datacontext.openMixtureOfSortedBoosters(0, 1, 0, 0, 0, 0,0,0,0,0).then(function (data) {
                    return addAICards(ai, data);
                });
            }

            totalPacksOpened += vm.fixedTHSpacks;
            if (vm.packsOpened <= totalPacksOpened)
            {
                return datacontext.openMixtureOfSortedBoosters(1, 0, 0, 0, 0, 0,0,0,0,0).then(function (data) {
                    return addAICards(ai, data);
                });
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