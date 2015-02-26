(function () {
    'use strict';

    var serviceId = 'datacontext';
    angular.module('app').factory(serviceId,
        ['common', 'landcards', datacontext]);

    function datacontext(common, landcards) {
        var $q = common.$q;

        function getSeedCardNumber(cardColor) {
            switch (cardColor) {
                case "W": return 27;
                case "U": return 67;
                case "B": return 100;
                case "R": return 161;
                case "G": return 190;
            }
        }

        var service = {
            openBoosters: openBoosters,
            getAllCards: getAllCards,
            getAllCardsByRarity: getAllCardsByRarity,
            getAllFRFCardsByRarity: getAllFRFCardsByRarity,
            getAllKTKCardsByRarity: getAllKTKCardsByRarity,
            getAllDTKCardsByRarity: getAllDTKCardsByRarity,
            getAllM15CardsByRarity: getAllM15CardsByRarity,
            getAllTHSCardsByRarity: getAllTHSCardsByRarity,
            getAllJOUCardsByRarity: getAllJOUCardsByRarity,
            setDisplayCard: setDisplayCard,
            getDisplayCard: getDisplayCard,
            openSortedBoosters: openSortedBoosters,
            openMixtureOfSortedBoosters: openMixtureOfSortedBoosters,
            openMixtureOfSeededBoosters: openMixtureOfSeededBoosters,
            getAllSet1CardsNoDelay: getAllSet1CardsNoDelay,
            getAllSet2CardsNoDelay: getAllSet2CardsNoDelay,
            getAllSet3CardsNoDelay: getAllSet3CardsNoDelay,
            getAllCoreSetCardsNoDelay: getAllCoreSetCardsNoDelay
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
            
            return $q.when(openXBNGBoosters(numBoosters));
        }

        function openMixtureOfSeededBoosters(numTHSBoosters, numBNGBoosters, numJOUBoosters, numCoreSetBoosters, numKTKBoosters, numFRFBoosters, numDTKBoosters, seedColor) {
            var chosenCards = openBoostersNoPromise(numTHSBoosters, numBNGBoosters, numJOUBoosters, numCoreSetBoosters, numKTKBoosters, numFRFBoosters, numDTKBoosters);
            //Replace core set boosters with seeded boosters.
            var cards = getAllKTKCardsSortedByRarity();
            var boostersToSeed = openXCardBoostersForColor(1, cards, seedColor);
            //boostersToSeed.rareCards.push(KTK[getSeedCardNumber(seedColor)]);

            boostersToSeed.rareCards.sort(cardSort);
            boostersToSeed.uncommonCards.sort(cardSort);
            boostersToSeed.commonCards.sort(cardSort);

            boostersToSeed.mythicCards.push.apply(boostersToSeed.mythicCards, chosenCards.mythicCards);
            boostersToSeed.rareCards.push.apply(boostersToSeed.rareCards, chosenCards.rareCards);
            boostersToSeed.uncommonCards.push.apply(boostersToSeed.uncommonCards, chosenCards.uncommonCards);
            boostersToSeed.commonCards.push.apply(boostersToSeed.commonCards, chosenCards.commonCards);
            return $q.when(boostersToSeed);
        }

        function openMixtureOfSortedBoosters(numTHSBoosters, numBNGBoosters, numJOUBoosters, numCoreSetBoosters, numKTKBoosters, numFRFBoosters, numDTKBoosters) {
            var chosenCards = openBoostersNoPromise(numTHSBoosters, numBNGBoosters, numJOUBoosters, numCoreSetBoosters, numKTKBoosters, numFRFBoosters, numDTKBoosters);
            return $q.when(chosenCards);

        }

        function openBoostersNoPromise(numTHSBoosters, numBNGBoosters, numJOUBoosters, numCoreSetBoosters, numKTKBoosters, numFRFBoosters, numDTKBoosters)
        {
            var cardsBNG = openXBNGBoosters(numBNGBoosters);

            cardsBNG.mythicCards.sort(cardSort);
            cardsBNG.rareCards.sort(cardSort);
            cardsBNG.uncommonCards.sort(cardSort);
            cardsBNG.commonCards.sort(cardSort);

            var cardsTHS = openXTHSBoosters(numTHSBoosters);

            cardsTHS.mythicCards.sort(cardSort);
            cardsTHS.rareCards.sort(cardSort);
            cardsTHS.uncommonCards.sort(cardSort);
            cardsTHS.commonCards.sort(cardSort);

            var cardsJOU = openXJOUBoosters(numJOUBoosters);

            cardsJOU.mythicCards.sort(cardSort);
            cardsJOU.rareCards.sort(cardSort);
            cardsJOU.uncommonCards.sort(cardSort);
            cardsJOU.commonCards.sort(cardSort);

            var cardsCore = openXCoreBoosters(numCoreSetBoosters);
            cardsCore.mythicCards.sort(cardSort);
            cardsCore.rareCards.sort(cardSort);
            cardsCore.uncommonCards.sort(cardSort);
            cardsCore.commonCards.sort(cardSort);

            var cardsKTK = openXKTKBoosters(numKTKBoosters);
            cardsKTK.mythicCards.sort(cardSort);
            cardsKTK.rareCards.sort(cardSort);
            cardsKTK.uncommonCards.sort(cardSort);
            cardsKTK.commonCards.sort(cardSort);

            var cardsFRF = openXFRFBoosters(numFRFBoosters);
            cardsFRF.mythicCards.sort(cardSort);
            cardsFRF.rareCards.sort(cardSort);
            cardsFRF.uncommonCards.sort(cardSort);
            cardsFRF.commonCards.sort(cardSort);

            var cardsDTK = openXDTKBoosters(numDTKBoosters);
            cardsDTK.mythicCards.sort(cardSort);
            cardsDTK.rareCards.sort(cardSort);
            cardsDTK.uncommonCards.sort(cardSort);
            cardsDTK.commonCards.sort(cardSort);


            cardsBNG.mythicCards.push.apply(cardsBNG.mythicCards, cardsTHS.mythicCards);
            cardsBNG.rareCards.push.apply(cardsBNG.rareCards, cardsTHS.rareCards);
            cardsBNG.uncommonCards.push.apply(cardsBNG.uncommonCards, cardsTHS.uncommonCards);
            cardsBNG.commonCards.push.apply(cardsBNG.commonCards, cardsTHS.commonCards);

            cardsBNG.mythicCards.push.apply(cardsBNG.mythicCards, cardsJOU.mythicCards);
            cardsBNG.rareCards.push.apply(cardsBNG.rareCards, cardsJOU.rareCards);
            cardsBNG.uncommonCards.push.apply(cardsBNG.uncommonCards, cardsJOU.uncommonCards);
            cardsBNG.commonCards.push.apply(cardsBNG.commonCards, cardsJOU.commonCards);

            cardsBNG.mythicCards.push.apply(cardsBNG.mythicCards, cardsCore.mythicCards);
            cardsBNG.rareCards.push.apply(cardsBNG.rareCards, cardsCore.rareCards);
            cardsBNG.uncommonCards.push.apply(cardsBNG.uncommonCards, cardsCore.uncommonCards);
            cardsBNG.commonCards.push.apply(cardsBNG.commonCards, cardsCore.commonCards);

            cardsBNG.mythicCards.push.apply(cardsBNG.mythicCards, cardsKTK.mythicCards);
            cardsBNG.rareCards.push.apply(cardsBNG.rareCards, cardsKTK.rareCards);
            cardsBNG.uncommonCards.push.apply(cardsBNG.uncommonCards, cardsKTK.uncommonCards);
            cardsBNG.commonCards.push.apply(cardsBNG.commonCards, cardsKTK.commonCards);

            cardsBNG.mythicCards.push.apply(cardsBNG.mythicCards, cardsFRF.mythicCards);
            cardsBNG.rareCards.push.apply(cardsBNG.rareCards, cardsFRF.rareCards);
            cardsBNG.uncommonCards.push.apply(cardsBNG.uncommonCards, cardsFRF.uncommonCards);
            cardsBNG.commonCards.push.apply(cardsBNG.commonCards, cardsFRF.commonCards);

            return cardsBNG;
        }

        function openSortedBoosters(numBoosters)
        {
            var cards = openXBNGBoosters(numBoosters);
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

        function openXJOUBoosters(numBoosters) {
            var cards = getAllJOUCardsSortedByRarity();
            return openXCardBoosters(numBoosters, cards);
        }

        function openXTHSBoosters(numBoosters) {
            var cards = getAllTherosCardsSortedByRarity();
            return openXCardBoosters(numBoosters, cards);
        }

        function openXCoreBoosters(numBoosters) {
            var cards = getAllM15CardsSortedByRarity();
            return openXCardBoosters(numBoosters, cards);
        }

        function openXKTKBoosters(numBoosters) {
            var cards = getAllKTKCardsSortedByRarity();
            return openXCardBoosters(numBoosters, cards);
        }

        function openXFRFBoosters(numBoosters) {
            var cards = getAllFRFCardsSortedByRarity();
            var openedCards = openXCardBoosters(numBoosters, cards);


            //In Fate Reforged there is a chance a basic land can be replaced by a fetchland or a life land.
            var chanceOfLifeLand = 1 / 1;
            var chanceOfFetchLand = 1 / 72;
            for (var i = 0; i < numBoosters; i++) {
                if (Math.random() < chanceOfLifeLand) {
                    if (Math.random() < chanceOfFetchLand) {
                        var ktkFetchLands = [229, 232, 238, 247, 248];
                        var cardNumberToGet = Math.round(Math.random() * (ktkFetchLands.length - 1));
                        var fetchLandToAdd = KTK[ktkFetchLands[cardNumberToGet]];
                        openedCards.rareCards.push(fetchLandToAdd);
                    } else {
                        var ktkLifeLands = [228, 230, 231, 234, 239, 241, 242, 243, 245, 246];
                        var ktkLifeLandToGet = Math.round(Math.random() * (ktkLifeLands.length - 1));
                        var lifeLandToAdd = KTK[ktkLifeLands[ktkLifeLandToGet]];
                        openedCards.commonCards.push(lifeLandToAdd);
                    }
                } else {
                    var lands = landcards.getLandCards();
                    var landCardNumberToGet = Math.round(Math.random() * (lands.length - 1));
                    openedCards.commonCards.push(lands[landCardNumberToGet]);
                }
            }

            return openedCards;
        }

        function openXDTKBoosters(numBoosters) {
            var cards = getAllDTKCardsSortedByRarity();
            return openXCardBoosters(numBoosters, cards);
        }

        function openXCardBoosters(numBoosters, cards) {
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

        function openXCardBoostersForColor(numBoosters, cards, color) {
            var selectedCards = new Cards();
            for (var i = 0; i < numBoosters; i++) {
                var boosterCards = openBoosterForColorKTK(cards, selectedCards, color);
                selectedCards.mythicCards.push.apply(selectedCards.mythicCards, boosterCards.mythicCards);
                selectedCards.rareCards.push.apply(selectedCards.rareCards, boosterCards.rareCards);
                selectedCards.uncommonCards.push.apply(selectedCards.uncommonCards, boosterCards.uncommonCards);
                selectedCards.commonCards.push.apply(selectedCards.commonCards, boosterCards.commonCards);
            }
            return selectedCards;
        }


        function openXBNGBoosters(numBoosters)
        {
            var cards = getAllCardsSortedByRarity();
            return openXCardBoosters(numBoosters, cards);
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
                if (cardToAdd != null) {
                    var containsCard = false;
                    $.each(cards.commonCards, function (index, value) {
                        if (value.Number == cardToAdd.Number) {
                            containsCard = true;
                        }
                    });
                    if (containsCard && allCards.commonCards.length > numberOfCommons) {
                        i--;
                    } else {
                        cards.commonCards.push(cardToAdd);
                    }
                }
            }
            for (var i = 0; i < numberOfUncommons; i++)
            {
                var cardNumberToGet = Math.round(Math.random() * (allCards.uncommonCards.length - 1));
                var cardToAdd = allCards.uncommonCards[cardNumberToGet];
                if (cardToAdd != null) {
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

        function getClanPromo(clan) { //FRF
            if (Math.random() > 7 / 8) {
                switch (clan) {
                    case "W":
                        return FRF[143 - 1];
                        break;
                    case "U":
                        return FRF[27 - 1];
                        break;
                    case "B":
                        return FRF[56 - 1];
                        break;
                    case "R":
                        return FRF[64 - 1];
                        break;
                    case "G":
                        return FRF[113 - 1];
                        break;
                }
            } else {
                var cardsToUse;
                switch (clan) {
                    case "W":
                        cardsToUse = [8, 9, 11, 151];
                        break;
                    case "U":
                        cardsToUse = [43, 50, 52, 156];
                        break;
                    case "B":
                        cardsToUse = [62, 79, 87, 157];
                        break;
                    case "R":
                        cardsToUse = [90, 99, 110, 155];
                        break;
                    case "G":
                        cardsToUse = [131, 142, 148, 149];
                        break;
                }
                var cardNumberToGet = cardsToUse[Math.floor(Math.random() * cardsToUse.length)];
                return FRF[cardNumberToGet - 1];
            }
        }

        function getSeededClanCardsCommonAndUncommons(clan) {
            var possibleColors = [];
            var excludedCards = [];
            switch (clan) {
                case "W":
                    possibleColors = ["W", "B", "G"];
                    excludedCards = [11, 14, 16, 17, 20, 22, 27, 31, 64, 66, 67, 72, 73, 75, 76, 77, 78, 81, 82, 88, 89, 90, 91, 130, 132, 134, 136, 137, 141, 143, 144 ,145, 146, 147, 148, 149, 151, 152, 153, 158, 169, 172, 192];
                    break;
                case "U":
                    possibleColors = ["U", "R", "W"];
                    excludedCards = [1,2,3,6,11,12,13,16,17,21,27,29,30,31,36,39,40,41,42,45,52,53,54,56,57,59,96,98,100,105,106,107,110,112,113,115,116,117,125,126];
                    break;
                case "B":
                    possibleColors = ["B", "G", "U"];
                    excludedCards = [36,38,39,40,41,42,43,44,46,48,49,50,51,52,53,56,58,63,64,66,70,77,78,79,85,94,128,132,133,134,139,140,143,144,145,147,149,153,156,158,178];
                    break;
                case "R":
                    possibleColors = ["R", "W", "B"];
                    excludedCards = [1,2,3,6,12,13,14,18,20,21,22,29,30,67,70,72,73,75,76,77,79,81,82,85,88,89,90,91,94,96,100,101,102,106,107,108,114,118,170,177];
                    break;
                case "G":
                    possibleColors = ["G", "U", "R"];
                    excludedCards = [36,38,43,44,45,46,48,49,50,51,54,57,58,59,63,98,101,102,105,108,110,113,114,115,116,117,118,125,126,128,130,133,136,137,139,140,141,146,148,151,152,156];
                    break;
            }

            var clanCards = new Cards();

            var cardsSorted = getAllKTKCardsSortedByRarity();
            var uncommonCards = cardsSorted.uncommonCards;
            var commonCards = cardsSorted.commonCards;

            for (var i = 0; i < 4; i++) {
                var cardFound = false;
                while (!cardFound) {
                    var possibleCard = uncommonCards[Math.floor(Math.random() * uncommonCards.length)];
                    var acceptableCard = true;
                    $.each(possibleCard.Color, function (index, value) {
                        if (possibleColors.indexOf(value) == -1) {
                            acceptableCard = false;
                        }
                    });
                    if (acceptableCard && excludedCards.indexOf(parseInt(possibleCard.Number)) == -1) {
                        clanCards.uncommonCards.push(possibleCard);
                        cardFound = true;
                    }
                }
            }

            for (var i = 0; i < 11; i++) {
                var cardFound = false;
                while (!cardFound) {
                    var possibleCard = commonCards[Math.floor(Math.random() * commonCards.length)];
                    var acceptableCard = true;
                    $.each(possibleCard.Color, function (index, value) {
                        if (possibleColors.indexOf(value) == -1) {
                            acceptableCard = false;
                        }
                    });
                    if (acceptableCard && excludedCards.indexOf(parseInt(possibleCard.Number)) == -1) {
                        clanCards.commonCards.push(possibleCard);
                        cardFound = true;
                    }
                }
            }
            return clanCards;
        }

        function getRandomKTKCardFromArray(cardNumbers) {
            var cardNumberToGet = cardNumbers[Math.floor(Math.random() * cardNumbers.length)];
            return KTK[cardNumberToGet - 1];
        }

        function getCardsOfCertainColor(cardSet, color, chanceOfOtherColor) {
            var singleColorCardSet = [];
            var seedCardNumber = getSeedCardNumber(color) + 1;
            $.each(cardSet, function (index, value) {
                if ((value.Number != seedCardNumber //Dissallow seeded card.
                    && value.Type[0] != "P"
                    && value.Color.indexOf(color) != -1
                    && value.Color.length == 1)
                    || (chanceOfOtherColor > 0
                    && Math.random() < chanceOfOtherColor)) {
                    singleColorCardSet.push(value);
                }
            });
            return singleColorCardSet;
        }

        function openBoosterForColorKTK(allCards, cardArray, color) {
            var clanCardSet = new Cards();

            var clanPromo = getClanPromo(color);
            if (clanPromo.Rarity = "R") {
                clanCardSet.rareCards = [clanPromo];
            } else {
                clanCardSet.mythicCards = [clanPromo];
            }

            var booster = getSeededClanCardsCommonAndUncommons(color);//openBoostersNoPromise(0, 0, 0, 0, 1);
            clanCardSet.uncommonCards = booster.uncommonCards;
            clanCardSet.commonCards = booster.commonCards;

            return clanCardSet;
        }

        function openBoosterForColor(allCards, cardsArray, color)
        {
            var singleColorCardSet = new Cards();
            singleColorCardSet.commonCards = getCardsOfCertainColor(allCards.commonCards, color, 0.6);
            singleColorCardSet.uncommonCards = getCardsOfCertainColor(allCards.uncommonCards, color, 0.5);
            singleColorCardSet.rareCards = getCardsOfCertainColor(allCards.rareCards, color, 0);

            singleColorCardSet.mythicCards = getCardsOfCertainColor(allCards.mythicCards, color, 0);

            var mythicChance = 1 / 8;
            var cards = new Cards();
            var containsAMythic = true;
            if (Math.random() > mythicChance) {
                containsAMythic = false;
            }
            var numberOfCommons = 10;
            var numberOfUncommons = 3;


            for (var i = 0; i < numberOfCommons; i++) {
                var cardNumberToGet = Math.round(Math.random() * (singleColorCardSet.commonCards.length - 1));
                var cardToAdd = singleColorCardSet.commonCards[cardNumberToGet];
                var containsCard = false;
                $.each(cards.commonCards, function (index, value) {
                    if (value.Number == cardToAdd.Number) {
                        containsCard = true;
                    }
                });
                if (containsCard && singleColorCardSet.commonCards.length > numberOfCommons) {
                    i--;
                } else {
                    cards.commonCards.push(cardToAdd);
                }
            }
            for (var i = 0; i < numberOfUncommons; i++) {
                var cardNumberToGet = Math.round(Math.random() * (singleColorCardSet.uncommonCards.length - 1));
                var cardToAdd = singleColorCardSet.uncommonCards[cardNumberToGet];
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
                var cardNumberToGet = Math.round(Math.random() * (singleColorCardSet.rareCards.length - 1));
                var cardToAdd = singleColorCardSet.rareCards[cardNumberToGet];
                cards.rareCards.push(cardToAdd);
            } else {
                var cardNumberToGet = Math.round(Math.random() * (singleColorCardSet.mythicCards.length - 1));
                var cardToAdd = singleColorCardSet.mythicCards[cardNumberToGet];
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

        function getAllDTKCardsByRarity() {
            return $q.when(getAllDTKCardsSortedByRarity())
        }
        function getAllDTKCardsSortedByRarity() {
            var cards = new Cards();
            DTK.forEach(function (card) {
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

        function getAllFRFCardsByRarity() {
            return $q.when(getAllFRFCardsSortedByRarity())
        }
        function getAllFRFCardsSortedByRarity() {
            return sortCardSet(FRF);
        }

        function getAllKTKCardsByRarity() {
            return $q.when(getAllKTKCardsSortedByRarity());
        }

        function getAllKTKCardsSortedByRarity() {
            return sortCardSet(KTK);
        }

        function getAllM15CardsByRarity() {
            return $q.when(getAllM15CardsSortedByRarity());
        }

        function getAllM15CardsSortedByRarity() 
        {
            return sortCardSet(M15);
        }

        function getAllTherosCardsSortedByRarity()
        {
            return sortCardSet(THS);
        }

        function getAllCardsSortedByRarity()
        {
            return sortCardSet(BNG);
        }

        function getAllJOUCardsSortedByRarity()
        {
            return sortCardSet(JOU);
        }

        function sortCardSet(cardSetVar) {
            var cards = new Cards();
            cardSetVar.forEach(function (card) {
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

        function getAllJOUCardsByRarity()
        {
            return $q.when(getAllJOUCardsSortedByRarity());
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

        function getAllSet3CardsNoDelay()
        {
            return JOU;
        }

        function getAllCoreSetCardsNoDelay() 
        {
            return M15;
        }
    }
})();