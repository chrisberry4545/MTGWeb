(function () {
    'use strict';

    var serviceId = 'datacontext';
    angular.module('app').factory(serviceId,
        ['common', datacontext]);

    function datacontext(common) {
        var $q = common.$q;

        var service = {
            openBoosters: openBoosters,
            getAllCards: getAllCards,
            getAllCardsByRarity: getAllCardsByRarity,
            getAllTHSCardsByRarity: getAllTHSCardsByRarity,
            setDisplayCard: setDisplayCard,
            getDisplayCard: getDisplayCard,
            openSortedBoosters: openSortedBoosters,
            openMixtureOfSortedBoosters: openMixtureOfSortedBoosters,
            getAllTHSCards: getAllTHSCards,
            getAllSet1CardsNoDelay: getAllSet1CardsNoDelay,
            getAllSet2CardsNoDelay: getAllSet2CardsNoDelay
        };

        var displayCard;

        return service;

        function setDisplayCard(card)
        {
            displayCard = card;
        }

        function getDisplayCard(card)
        {
            return displayCard;
        }

        function openBoosters(numBoosters)
        {
            
            return $q.when(openXBoosters(numBoosters));
        }

        function openMixtureOfSortedBoosters(numTHSBoosters, numBNGBoosters) {
            var chosenCards = openBoostersNoPromise(numTHSBoosters, numBNGBoosters);
            return $q.when(chosenCards);

        }

        function openBoostersNoPromise(numTHSBoosters, numBNGBoosters)
        {
            var cardsBNG = openXBoosters(numBNGBoosters);

            cardsBNG.mythicCards.sort(cardSort);
            cardsBNG.rareCards.sort(cardSort);
            cardsBNG.uncommonCards.sort(cardSort);
            cardsBNG.commonCards.sort(cardSort);

            var cardsTHS = openXTHSBoosters(numTHSBoosters);

            cardsTHS.mythicCards.sort(cardSort);
            cardsTHS.rareCards.sort(cardSort);
            cardsTHS.uncommonCards.sort(cardSort);
            cardsTHS.commonCards.sort(cardSort);

            cardsBNG.mythicCards.push.apply(cardsBNG.mythicCards, cardsTHS.mythicCards);
            cardsBNG.rareCards.push.apply(cardsBNG.rareCards, cardsTHS.rareCards);
            cardsBNG.uncommonCards.push.apply(cardsBNG.uncommonCards, cardsTHS.uncommonCards);
            cardsBNG.commonCards.push.apply(cardsBNG.commonCards, cardsTHS.commonCards);


            return cardsBNG;
        }

        function openSortedBoosters(numBoosters)
        {
            var cards = openXBoosters(numBoosters);
            cards.mythicCards.sort(cardSort);
            cards.rareCards.sort(cardSort);
            cards.uncommonCards.sort(cardSort);
            cards.commonCards.sort(cardSort);

            return $q.when(cards);
        }

        function cardSort(a, b) {
            if (a.Number < b.Number)
                return -1;
            if (a.Number > b.Number)
                return 1;
            return 0;
        }

        function openXTHSBoosters(numBoosters) {
            var cards = getAllTherosCardsSortedByRarity();
            var selectedCards = new Cards();
            for (var i = 0; i < numBoosters; i++) {
                var boosterCards = openBooster(cards, selectedCards);
                selectedCards.mythicCards.push.apply(selectedCards.mythicCards, boosterCards.mythicCards);
                selectedCards.rareCards.push.apply(selectedCards.rareCards, boosterCards.rareCards);
                selectedCards.uncommonCards.push.apply(selectedCards.uncommonCards, boosterCards.uncommonCards);
                selectedCards.commonCards.push.apply(selectedCards.commonCards, boosterCards.commonCards);
            }
            return selectedCards;
        }


        function openXBoosters(numBoosters)
        {
            var cards = getAllCardsSortedByRarity();

            var selectedCards = new Cards();
            for(var i = 0; i < numBoosters; i++)
            {
                var boosterCards = openBooster(cards, selectedCards);
                selectedCards.mythicCards.push.apply(selectedCards.mythicCards, boosterCards.mythicCards);
                selectedCards.rareCards.push.apply(selectedCards.rareCards, boosterCards.rareCards);
                selectedCards.uncommonCards.push.apply(selectedCards.uncommonCards, boosterCards.uncommonCards);
                selectedCards.commonCards.push.apply(selectedCards.commonCards, boosterCards.commonCards);
            }
            return selectedCards;
        }

        function openBooster(allCards, cardsArray)
        {
            var mythicChance = 1 / 8;
            var cards = new Cards();
            var containsAMythic = true;
            if (Math.random() > mythicChance) {
                containsAMythic = false;
            }
            var numberOfCommons = 10;
            var numberOfUncommons = 3;


            for (var i = 0; i < numberOfCommons; i++)
            {
                var cardNumberToGet = Math.round(Math.random() * (allCards.commonCards.length - 1));
                var cardToAdd = allCards.commonCards[cardNumberToGet];
                var containsCard = false;
                $.each(cards.commonCards, function (index, value) {
                    if (value.Number == cardToAdd.Number) {
                        containsCard = true;
                    }
                });
                if (containsCard) {
                    numberOfCommons++;
                } else {
                    cards.commonCards.push(cardToAdd);
                }
            }
            for (var i = 0; i < numberOfUncommons; i++)
            {
                var cardNumberToGet = Math.round(Math.random() * (allCards.uncommonCards.length - 1));
                var cardToAdd = allCards.uncommonCards[cardNumberToGet];
                var containsCard = false;
                $.each(cards.uncommonCards, function (index, value) {
                    if (value.Number == cardToAdd.Number) {
                        containsCard = true;
                    }
                });
                if (containsCard) {
                    numberOfUncommons++;
                } else {
                    cards.uncommonCards.push(cardToAdd);
                }
            }

            if (!containsAMythic) {
                var cardNumberToGet = Math.round(Math.random() * (allCards.rareCards.length - 1));
                var cardToAdd = allCards.rareCards[cardNumberToGet];
                cards.rareCards.push(cardToAdd);
            } else {
                var cardNumberToGet = Math.round(Math.random() * (allCards.mythicCards.length - 1));
                var cardToAdd = allCards.mythicCards[cardNumberToGet];
                cards.mythicCards.push(cardToAdd);
            }

            return cards;
        }

        function Cards()
        {
            this.mythicCards = [];
            this.rareCards = [];
            this.uncommonCards = [];
            this.commonCards = [];
        }

        function Card(name, rarity, imgSrc) {
            this.name = name;
            this.rarity = rarity;
            this.src = imgSrc;
        }

        function getAmountOfCards(amount, fromArray)
        {
            var cards = [];
            for (var i = 0; i < amount; i++) {
                var cardNumberToGet = Math.round(Math.random() * (fromArray.length - 1));
                var cardToAdd = fromArray[cardNumberToGet];
                cards[i] = cardToAdd;
            }
            return cards;
        }

        //function getAllCards()
        //{
        //    var cards = new Cards();
        //    cards.mythicCards = mythicCards;
        //    cards.rareCards = rareCards;
        //    cards.uncommonCards = uncommonCards;
        //    cards.commonCards = commonCards;
        //    return $q.when(cards);
        //}

        function getAllTherosCardsSortedByRarity()
        {
            var cards = new Cards();
            THS.forEach(function (card) {
                if (card.Rarity == 'C') {
                    cards.commonCards.push(card);
                }
                else if (card.Rarity == 'U') {
                    cards.uncommonCards.push(card);
                }
                else if (card.Rarity == 'R') {
                    cards.rareCards.push(card);
                }
                else if (card.Rarity == 'M') {
                    cards.mythicCards.push(card);
                }
            });
            return cards;
        }

        function getAllCardsSortedByRarity()
        {
            var cards = new Cards();
            BNG.forEach(function (card) {
                if (card.Rarity == 'C') {
                    cards.commonCards.push(card);
                }
                else if (card.Rarity == 'U') {
                    cards.uncommonCards.push(card);
                }
                else if (card.Rarity == 'R') {
                    cards.rareCards.push(card);
                }
                else if (card.Rarity == 'M') {
                    cards.mythicCards.push(card);
                }
            });
            return cards;
        }

        function getAllTHSCardsByRarity() {
            return $q.when(getAllTherosCardsSortedByRarity());
        }

        function getAllCardsByRarity()
        {
            return $q.when(getAllCardsSortedByRarity());
        }

        function getAllCards()
        {
            return $q.when(BNG);
        }

        function getAllTHSCards() {
            return $q.when(THS);
        }

        function getAllSet1CardsNoDelay()
        {
            return THS;
        }

        function getAllSet2CardsNoDelay()
        {
            return BNG;
        }
    }
})();