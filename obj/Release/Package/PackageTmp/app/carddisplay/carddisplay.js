(function () {
    'use strict';
    var controllerId = 'carddisplay';
    angular.module('app').controller(controllerId, ['common', 'datacontext', carddisplay]);

    function carddisplay(common, datacontext) {
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);

        var vm = this;

        vm.title = 'News';
        vm.cardToDisplay;

        activate();

        function activate() {
            var promises = [getCardToDisplay()];
            common.activateController(promises, controllerId)
                .then(function () { log('Activated Dashboard View'); });
        }

        function getCardToDisplay()
        {
            vm.cardToDisplay = datacontext.getDisplayCard();
        }

        vm.convertToColor = function (colorArray)
        {
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
            var rarityString = "";
            var result = rarityMap.filter(function (obj) {
                return obj.code == rarityCode;
            });
            rarityString += result[0].rarity;
            return rarityString;
        }

        var rarityMap = [
            { code: "C", rarity: "Common" },
            { code: "U", rarity: "Uncommon" },
            { code: "R", rarity: "Rare" },
            { code: "M", rarity: "Mythic" }
        ];

        vm.convertToType = function (typeArray) {
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