﻿(function () {
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
        vm.BFZCards = [];
        vm.ORICards = [];
        vm.MM2Cards = [];
        vm.DTKCards = [];
        vm.FRFCards = [];
        vm.KTKCards = [];
        vm.M15Cards = [];
        vm.THSCards = [];
        vm.BNGCards = [];
        vm.JOUCards = [];
        vm.cards = [];

        vm.selectedSet = "10";

        vm.swapCards = function()
        {
            console.log("selcedted set: " + vm.selectedSet);
            switch(vm.selectedSet)
            {
                case "10":
                    if (vm.BFZCards.commonCards != null) {
                        vm.cards = vm.BFZCards;
                    } else {
                        getAllBFZCards().then(function () {
                            vm.cards = vm.BFZCards;
                        });
                    }
                    break;
                case "9":
                    if (vm.ORICards.commonCards != null) {
                        vm.cards = vm.ORICards;
                    } else {
                        getAllORICards().then(function () {
                            vm.cards = vm.ORICards;
                        });
                    }
                    break;
                case "8":
                    if (vm.MM2Cards.commonCards != null) {
                        vm.cards = vm.MM2Cards;
                    } else {
                        getAllMM2Cards().then(function () {
                            vm.cards = vm.MM2Cards;
                        });
                    }
                    break;
                case "7":
                    if (vm.DTKCards.commonCards != null) {
                        vm.cards = vm.DTKCards;
                    } else {
                        getAllDTKCards().then(function () {
                            vm.cards = vm.DTKCards;
                        });
                    }
                    break;
                case "6":
                    if (vm.FRFCards.commonCards != null) {
                        vm.cards = vm.FRFCards;
                    } else {
                        getAllFRFCards().then(function () {
                            vm.cards = vm.FRFCards;
                        });
                    }
                    break;
                case "5":
                    if (vm.KTKCards.commonCards != null) {
                        vm.cards = vm.KTKCards;
                    } else {
                        getAllKTKCards().then(function () {
                            vm.cards = vm.KTKCards;
                        });
                    }
                    break;
                case "1":
                    if (vm.M15Cards.commonCards != null) {
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
            common.activateController([getAllBFZCards()], controllerId)
                .then(function () {
                    vm.cards = vm.BFZCards;
                });
        }
        
        function getAllBFZCards() {
            return datacontext.getAllBFZCardsByRarity().then(function (data) {
                return vm.BFZCards = data;
            });
        }

        function getAllORICards() {
            return datacontext.getAllORICardsByRarity().then(function (data) {
                return vm.ORICards = data;
            });
        }

        function getAllMM2Cards() {
            return datacontext.getAllMM2CardsByRarity().then(function (data) {
                return vm.MM2Cards = data;
            });
        }

        function getAllDTKCards() {
            return datacontext.getAllDTKCardsByRarity().then(function (data) {
                return vm.DTKCards = data;
            });
        }

        function getAllFRFCards() {
            return datacontext.getAllFRFCardsByRarity().then(function(data) {
                return vm.FRFCards = data;
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