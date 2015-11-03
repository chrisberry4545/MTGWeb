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
        vm.controllerId = controllerId;

        vm.landcards = [];
        vm.selectedLandCards = [];


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

        vm.setGroups = [];
        function initSetGroups() {
            datacontext.getCardSetGroups().then(function (data) {
                data[0][0].boostersToOpen = 6; //Set latest set to open 6 boosters by default
                vm.setGroups = data;
            });
        }

        vm.chartsHidden = false;
        vm.hideCharts = function () {
            vm.chartsHidden = !vm.chartsHidden;
        }

        vm.include_promo = "1";
        vm.promo_options =
            [
                {
                    value: 1, text: "Include Promo"
                },
                {
                    value: 0, text: "Don't include Promo"
                }
            ];


        vm.boosterCards = [];

        vm.selectedCards = [];

        vm.saveSelection = function () {
            downloadDataService.saveCardsList(vm.selectedCards.concat(vm.selectedLandCards), "sealedselection");
            trackEvent(controllerId, 'save-selected-cards');
        }
        vm.saveCardsInBooster = function () {
            downloadDataService.saveCardsList(vm.boosterCards, "cardsRemainingInPool");
            trackEvent(controllerId, 'save-booster-cards');
        }
        vm.saveCompletePool = function () {
            downloadDataService.saveCardsList(vm.selectedCards.concat(vm.boosterCards), "sealedPool");
            trackEvent(controllerId, 'save-complete-pool');
        }

        vm.addLandCard = function (card) {
            vm.selectedLandCards.push(card);
            trackEvent(controllerId, 'add-land-card', card.Name);
        }
        vm.removeLandCard = function (card) {
            var index = vm.selectedLandCards.indexOf(card);
            if (index > -1) {
                vm.selectedLandCards.splice(index, 1);
                trackEvent(controllerId, 'remove-land-card', card.Name);
            }
        }

        vm.addToDeck = function(card)
        {
            logSuccess("Added " + card.Name + " to your selection...");
            _removeFromArrayAndAddToArray(vm.boosterCards, vm.selectedCards, card);
            trackEvent(controllerId, 'add-to-deck', card.Name);
        };

        vm.removeFromDeck = function(card)
        {
            log("Put " + card.Name + " back into sealed pool...")
            _removeFromArrayAndAddToArray(vm.selectedCards, vm.boosterCards, card);
            trackEvent(controllerId, 'remove-from-deck', card.Name);
        }

        vm.clearSelection = function () {
            var confirmed = confirm("Are you sure you want to clear your selection?");
            if (confirmed) {
                for (var i = 0; i < vm.selectedCards.length; i++) {
                    vm.boosterCards.push(vm.selectedCards[i]);
                }
                vm.selectedCards = [];
                vm.selectedLandCards = [];
            }
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
            vm.boosterCards = [];
            vm.selectedCards = [];
            vm.selectedLandCards = [];

            var cardsToUse = datacontext.openBoostersForCardSetGroups(vm.setGroups);
            vm.boosterCards.push.apply(vm.boosterCards, cardsToUse.mythicCards);
            vm.boosterCards.push.apply(vm.boosterCards, cardsToUse.rareCards);
            vm.boosterCards.push.apply(vm.boosterCards, cardsToUse.uncommonCards);
            vm.boosterCards.push.apply(vm.boosterCards, cardsToUse.commonCards);

            if (vm.include_promo == "1") {
                datacontext.addPromoForLatestSet(vm.boosterCards);
                trackEvent(controllerId, 'include-promo');
            } else {
                trackEvent(controllerId, 'exclude-promo');
            }

            return;
        };

        activate();

        function activate() {
            common.activateController([initSetGroups()], controllerId)
                .then(function () {
                    vm.landcards = landcards.getLandCards();
                    trackEvent(controllerId, 'init');
                });
        };
    }
})();