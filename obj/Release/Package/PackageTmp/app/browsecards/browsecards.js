(function () {
    'use strict';
    var controllerId = 'browsecards';
    angular.module('app').controller(controllerId, ['common', 'datacontext', '$scope', browsecards]);

    function browsecards(common, datacontext, $scope) {
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);

        var vm = this;
        vm.title = 'Card Browser';
        vm.column1Title = "Image";
        vm.column2Title = "Name";
        vm.column3Title = "Rarity";

        vm.slideInterval = 5000;

        vm.showingTHS = false;
        vm.showingBNG = true;
        vm.THSCards = [];
        vm.BNGCards = [];
        vm.cards = [];

        vm.swapCards = function()
        {
            if (!vm.showingTHS)
            {
                if (vm.THSCards.commonCards != null)
                {
                    vm.cards = vm.THSCards;
                } else {
                    getAllTHSCards().then(function () {
                        vm.cards = vm.THSCards;
                    });
                }
                vm.showingTHS = true;
                vm.showingBNG = false;
            }
            else {
                vm.cards = vm.BNGCards;
                vm.showingTHS = false;
                vm.showingBNG = true;
            }
        }
 
        activate();

        function activate() {
            common.activateController([getAllBNGCards()], controllerId)
                .then(function () {
                    vm.cards = vm.BNGCards;
                });
        }

        function getAllBNGCards()
            {
            return datacontext.getAllCardsByRarity().then(function (data) {
                return vm.BNGCards = data;
            });
        }

        function getAllTHSCards()
        {
            return datacontext.getAllTHSCardsByRarity().then(function (data) {
                return vm.THSCards = data;
            });
        }

    }
})();