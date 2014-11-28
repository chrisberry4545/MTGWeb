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
        vm.column1Title = "Image";
        vm.column2Title = "Name";
        vm.column3Title = "Rarity";


        vm.boosters_to_open_ktk = 3;

        vm.boosters_to_open_core = localStorageService.getBoosterSim_numBoosters_setZero() || 0;
        vm.boosters_to_open_ths = localStorageService.getBoosterSim_numBoosters_setOne() || 0;
        vm.boosters_to_open_bng = localStorageService.getBoosterSim_numBoosters_setTwo() || 0;
        vm.boosters_to_open_jou = localStorageService.getBoosterSim_numBoosters_setThree() || 0;

        vm.cards = [];


        function storeValues() {
            localStorageService.setBoosterSim_numBoosters_setZero(vm.boosters_to_open_core);
            localStorageService.setBoosterSim_numBoosters_setOne(vm.boosters_to_open_ths);
            localStorageService.setBoosterSim_numBoosters_setTwo(vm.boosters_to_open_bng);
            localStorageService.setBoosterSim_numBoosters_setThree(vm.boosters_to_open_jou);
        }

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

        vm.openBoosters = function()
        {
            if (!validateEntries()) {
                return false;
            }

            storeValues();
            return datacontext.openMixtureOfSortedBoosters(
                parseInt(vm.boosters_to_open_ths),
                parseInt(vm.boosters_to_open_bng),
                parseInt(vm.boosters_to_open_jou),
                parseInt(vm.boosters_to_open_core),
                parseInt(vm.boosters_to_open_ktk)
                ).then(function (data) {
                    vm.cards = [];
                    log("Opening booster packs...");
                    vm.cards.push.apply(vm.cards, data.mythicCards);
                    vm.cards.push.apply(vm.cards, data.rareCards);
                    vm.cards.push.apply(vm.cards, data.uncommonCards);
                    vm.cards.push.apply(vm.cards, data.commonCards);
                    return vm.cards;
            });
        }

        activate();

        function activate() {
            common.activateController([], controllerId)
                .then(function () { });
        }
    }
})();