(function () {
    'use strict';

    var serviceId = 'handsimulator';
    angular.module('app').factory(serviceId,
        ['common', 'deckFunctions', handsimulator]);


    function handsimulator(common, deckFunctions) {

        var remainingCards = [];

        //Send whole deck over
        function generateHand(deckCards, sizeOfHand) {
            //Draw 7 cards
            var cardsToDraw = sizeOfHand;
            //Shuffle array and take first X elements
            var shuffledDeck = deckFunctions.shuffleDeck(deckCards);
            var first7Cards = deckFunctions.drawXCards(shuffledDeck, cardsToDraw);

            remainingCards = deckFunctions.getRemainingCards(shuffledDeck, sizeOfHand);

            return first7Cards;
        }

        function getNextCard() {
            if (remainingCards.length > 0) {
                return remainingCards.shift();
            } else {
                return null;
            }
        }


        var service = {
            generateHand: generateHand,
            getNextCard: getNextCard
        };


        return service;
    }
})();