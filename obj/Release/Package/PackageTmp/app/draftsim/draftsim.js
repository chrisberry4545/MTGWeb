(function () {
    'use strict';
    var controllerId = 'draftsim';
    angular.module('app').controller(controllerId, ['common', 'datacontext', draftsim]);

    function draftsim(common, datacontext) {
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);
        var logSuccess = common.logger.getLogFn(controllerId, 'success');

        var vm = this;
        vm.title = 'Sealed Simulator';
        vm.column1Title = "Image";
        vm.column2Title = "Name";
        vm.column3Title = "Rarity";

        vm.boosters_to_open = 1;

        vm.boosters_to_open_bng = 1;
        vm.boosters_to_open_ths = 2;

        vm.boosterCards = [];

        vm.selectedCards = [];
        
        vm.draftFinished = false;
        vm.draftStarted = false;
        vm.packsOpened = 0;
        vm.totalPacksToOpen = 3;

        vm.fixedBNGpacks = 0;
        vm.fixedTHSpacks = 0;

        vm.addToDeck = function(card)
        {
            _removeFromArrayAndAddToArray(vm.boosterCards, vm.selectedCards, card);
            logSuccess("You've chosen " + card.Name + "!");
            takeTurn();
        };

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
            if (vm.packsOpened >= vm.totalPacksToOpen)
            {
                vm.draftFinished = true;
            }
        }

        activate();

        function activate() {
            common.activateController([], controllerId)
                .then(function () { });
        };

        
        vm.numberOfPlayers = 8;
        vm.AIs = [];

        vm.startDraft = function () {
            vm.draftStarted = true;
            vm.draftFinished = false;
            //Clear the current boosters and selected cards.
            vm.boosterCards = [];
            vm.selectedCards = [];
            vm.fixedBNGpacks = parseInt(vm.boosters_to_open_bng);
            vm.fixedTHSpacks = parseInt(vm.boosters_to_open_ths);
            vm.totalPacksToOpen = vm.fixedBNGpacks + vm.fixedTHSpacks;
            vm.packsOpened = 1;
            //Open the first booster pack.
            setUpAIs();
            //Set player to vm.
            vm.boosterCards = vm.AIs[0].boosterCards;
            log("You've started a new draft with " + vm.fixedBNGpacks + " BNG packs and " + vm.fixedTHSpacks + " Theros packs.");
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
            if (vm.packsOpened <= vm.fixedBNGpacks)
            {
                return datacontext.openSortedBoosters(1).then(function (data) {
                    ai.boosterCards.push.apply(ai.boosterCards, data.mythicCards);
                    ai.boosterCards.push.apply(ai.boosterCards, data.rareCards);
                    ai.boosterCards.push.apply(ai.boosterCards, data.uncommonCards);
                    ai.boosterCards.push.apply(ai.boosterCards, data.commonCards);
                    return ai.boosterCards;
                });
            } else {
                return datacontext.openMixtureOfSortedBoosters(1, 0).then(function (data) {
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