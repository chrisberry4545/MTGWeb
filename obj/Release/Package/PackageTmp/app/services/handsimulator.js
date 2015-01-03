(function () {
    'use strict';

    var serviceId = 'handsimulator';
    angular.module('app').factory(serviceId,
        ['common', 'deckFunctions', handsimulator]);


    function handsimulator(common, deckFunctions) {

        //Send whole deck over
        function generateHand(deckCards, sizeOfHand) {
            //Draw 7 cards
            var cardsToDraw = sizeOfHand;
            //Shuffle array and take first X elements
            var shuffledDeck = deckFunctions.shuffleDeck(deckCards);
            var first7Cards = deckFunctions.drawXCards(shuffledDeck, cardsToDraw);
            return first7Cards;
        }


        var service = {
            generateHand: generateHand
        };


        return service;
    }
})();