(function () {
    'use strict';
    var controllerId = 'boostersim';
    angular.module('app').controller(controllerId, ['common', 'datacontext', boostersim]);

    function boostersim(common, datacontext) {
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);

        var vm = this;
        vm.title = 'Booster Simulator';
        vm.column1Title = "Image";
        vm.column2Title = "Name";
        vm.column3Title = "Rarity";

        vm.boosters_to_open = 3;
        vm.boosters_to_open_ths = 0;

        vm.cards = [];

        vm.openBoosters = function()
        {
            return datacontext.openMixtureOfSortedBoosters(vm.boosters_to_open_ths, vm.boosters_to_open).then(function (data) {
                vm.cards = [];
                log("Opened " + vm.boosters_to_open + " booster packs...");
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