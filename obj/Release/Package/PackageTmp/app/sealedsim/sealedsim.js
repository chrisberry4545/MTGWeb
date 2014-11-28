(function () {
    'use strict';
    var controllerId = 'sealedsim';
    angular.module('app').controller(controllerId, ['common', 'datacontext', sealedsim]);

    function sealedsim(common, datacontext) {
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);
        var logSuccess = common.logger.getLogFn(controllerId, 'success');

        var vm = this;
        vm.title = 'Sealed Simulator';
        vm.column1Title = "Image";
        vm.column2Title = "Name";
        vm.column3Title = "Rarity";

        vm.boosters_to_open = 3;
        vm.boosters_to_open_ths = 3;

        vm.boosterCards = [];

        vm.selectedCards = [];

        vm.addToDeck = function(card)
        {
            logSuccess("Added " + card.Name + " to your selection...");
            _removeFromArrayAndAddToArray(vm.boosterCards, vm.selectedCards, card);
        };

        vm.removeFromDeck = function(card)
        {
            log("Put " + card.Name + " back into sealed pool...")
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
            return datacontext.openMixtureOfSortedBoosters(vm.boosters_to_open_ths, vm.boosters_to_open).then(function (data) {
                log("Opened " + vm.boosters_to_open + " BNG booster packs and " + vm.boosters_to_open_ths + " THS Boosters...");
                vm.boosterCards = [];
                vm.selectedCards = [];
                vm.boosterCards.push.apply(vm.boosterCards, data.mythicCards);
                vm.boosterCards.push.apply(vm.boosterCards, data.rareCards);
                vm.boosterCards.push.apply(vm.boosterCards, data.uncommonCards);
                vm.boosterCards.push.apply(vm.boosterCards, data.commonCards);
                return vm.boosterCards;
            });
        };

        activate();

        function activate() {
            common.activateController([], controllerId)
                .then(function () { });
        };
    }
})();