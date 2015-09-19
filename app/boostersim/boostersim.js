(function () {
    'use strict';
    var controllerId = 'boostersim';
    angular.module('app').controller(controllerId, ['common', 'datacontext', 'localStorageService', boostersim]);

    function boostersim(common, datacontext, localStorageService) {
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);
        var logError = common.logger.getLogFn(controllerId, 'error');

        var vm = this;
        vm.title = 'Booster Simulator';
        vm.cards = [];

        vm.setGroups = [];

        function initSetGroups() {
            datacontext.getCardSetGroups().then(function (data) {
                data[0][0].boostersToOpen = 6; //Set latest set to open 6 boosters by default
                vm.setGroups = data;
            });
        }

        vm.showExtraOptions = false;
        vm.displayExtraOptions = function () {
            if (vm.showExtraOptions) {
                vm.showExtraOptions = false;
            } else {
                vm.showExtraOptions = true;
            }
        }

        vm.openBoosters = function()
        {
            vm.cards = [];

            var cardsToUse = datacontext.openBoostersForCardSetGroups(vm.setGroups);
            vm.cards.push.apply(vm.cards, cardsToUse.mythicCards);
            vm.cards.push.apply(vm.cards, cardsToUse.rareCards);
            vm.cards.push.apply(vm.cards, cardsToUse.uncommonCards);
            vm.cards.push.apply(vm.cards, cardsToUse.commonCards);

            return;
        }

        activate();

        function activate() {
            common.activateController([initSetGroups()], controllerId)
                .then(function () {
                    trackEvent(controllerId, 'init');
                });
        }
    }
})();