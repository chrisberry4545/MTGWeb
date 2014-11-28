(function () {
    'use strict';
    var controllerId = 'dashboard';
    angular.module('app').controller(controllerId, ['common', 'datacontext', dashboard]);

    function dashboard(common, datacontext) {
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);

        var vm = this
        vm.allCards = [];

        vm.cardClicked = function(c)
        {
            datacontext.setDisplayCard(c);
            location.href = "/#/carddisplay";
        }
        vm.goToDraftSim = function () {
            sendToLocation("/#/draftsim");
        }
        vm.goToBoosterSim = function () {
            sendToLocation("/#/boostersim");
        }
        vm.goToBrowseCards = function () {
            sendToLocation("/#/browsecards");
        }
        vm.goToSealedSim = function () {
            sendToLocation("/#/sealedsim");
        }
        vm.goToMultiplayerDraftSim = function () {
            sendToLocation("/#/multiplayerdraft");
        }

        function sendToLocation(destination) {
            location.href = destination;
        }


        activate();

        function activate() {
            var promises = [getAllCards()];
            common.activateController(promises, controllerId)
                .then(function () {
                    preload();
                });
        }

        var images = new Array();
        function preload() {
            
            //var fullCards = vm.allCards.concat(vm.THSCards);
            //for (var i = 0; i < fullCards.length; i++) {
            //    images[i] = new Image();
            //    images[i].src = fullCards[i].src;
            //}
        }

        function getAllCards() {
            //var set3Cards = datacontext.getAllSet3CardsNoDelay().slice(0);
            //var set1Cards = datacontext.getAllSet1CardsNoDelay().slice(0);
            //var set2Cards = datacontext.getAllSet2CardsNoDelay().slice(0);

            //vm.allCards = $.merge(set3Cards, set2Cards);
            //vm.allCards = $.merge(vm.allCards, set1Cards);
            //vm.allCards = datacontext.getAllCoreSetCardsNoDelay().slice(0);
        }


        vm.convertToColor = function (colorArray)
        {
            if (colorArray == null)
            {
                return "";
            }
            var colorString = "";
            colorArray.forEach(function (color) {
                var result = colorMap.filter(function (obj) {
                    return obj.code == color;
                });
                colorString += result[0].color;
            })
            return colorString;
        }

        var colorMap = [
            { code: "W", color: "White " },
            { code: "U", color: "Blue " },
            { code: "B", color: "Black " },
            { code: "R", color: "Red " },
            { code: "G", color: "Green " },
            { code: "C", color: "Colorless" }
        ];

        vm.convertToRarity = function (rarityCode) {
            if (rarityCode == null)
            {
                return "";
            }
            var rarityString = "";
            var result = rarityMap.filter(function (obj) {
                return obj.code == rarityCode;
            });
            return rarityString;
        }

        var rarityMap = [
            { code: "C", rarity: "Common" },
            { code: "U", rarity: "Uncommon" },
            { code: "R", rarity: "Rare" },
            { code: "M", rarity: "Mythic" }
        ];

        vm.convertToType = function (typeArray) {
            if (typeArray == null) {
                return "";
            }
            var typeString = "";
            typeArray.forEach(function (type) {
                var result = typeMap.filter(function (obj) {
                    return obj.code == type;
                });
                typeString += result[0].type;
            })
            return typeString;
        }

        var typeMap = [
            { code: "C", type: "Creature " },
            { code: "E", type: "Enchantment " },
            { code: "S", type: "Sorcery " },
            { code: "I", type: "Instant " },
            { code: "A", type: "Artifact " },
            { code: "L", type: "Land " },
            { code: "P", type: "Planeswalker " }
        ];
    }
})();