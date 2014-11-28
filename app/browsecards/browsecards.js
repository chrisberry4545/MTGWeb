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
        vm.KTKCards = [];
        vm.THSCards = [];
        vm.BNGCards = [];
        vm.JOUCards = [];
        vm.cards = [];

        vm.selectedSet = "0";

        vm.swapCards = function()
        {
            switch(vm.selectedSet)
            {
                case "0":
                    if (vm.KTKCards != null) {
                        vm.cards = vm.KTKCards;
                    } else {
                        getAllKTKCards().then(function () {
                            vm.cards = vm.KTKCards;
                        });
                    }
                    break;
                case "1":
                    if (vm.M15Cards != null) {
                        vm.cards = vm.M15Cards;
                    } else {
                        getAllM15Cards().then(function () {
                            vm.cards = vm.M15Cards;
                        });
                    }
                    break;
                case "2":
                    if (vm.THSCards.commonCards != null) {
                        vm.cards = vm.THSCards;
                    } else {
                        getAllTHSCards().then(function () {
                            vm.cards = vm.THSCards;
                        });
                    }
                    break;
                case "3":
                    if (vm.BNGCards.commonCards != null) {
                        vm.cards = vm.BNGCards;
                    } else {
                        getAllBNGCards().then(function () {
                            vm.cards = vm.BNGCards;
                        });
                    }
                    break;
                case "4":
                    if (vm.JOUCards.commonCards != null) {
                        vm.cards = vm.JOUCards;
                    } else {
                        getAllJOUCards().then(function () {
                            vm.cards = vm.JOUCards;
                        });
                    }
                    
                    break;
            }
        }
 
        activate();

        function activate() {
            common.activateController([getAllKTKCards()], controllerId)
                .then(function () {
                    vm.cards = vm.KTKCards;
                });
        }

        function getAllKTKCards() {
            return datacontext.getAllKTKCardsByRarity().then(function (data) {
                return vm.KTKCards = data;
            });
        }

        function getAllM15Cards()
        {
            return datacontext.getAllM15CardsByRarity().then(function (data) {
                return vm.M15Cards = data;
            });
        }

        function getAllJOUCards()
        {
            return datacontext.getAllJOUCardsByRarity().then(function (data) {
                return vm.JOUCards = data;
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