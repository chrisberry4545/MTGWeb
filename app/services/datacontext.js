(function () {
    'use strict';

    var serviceId = 'datacontext';
    angular.module('app').factory(serviceId,
        ['common', 'landcards', datacontext]);

    function datacontext(common, landcards) {
        var $q = common.$q;

        function getSeedCardNumber(cardColor) {
            return -1;
            //switch (cardColor) {
            //    case "W": return 27;
            //    case "U": return 67;
            //    case "B": return 100;
            //    case "R": return 161;
            //    case "G": return 190;
            //}
        }

        var service = {
            openBoosters: openBoosters,
            getAllCards: getAllCards,
            getAllCardsByRarity: getAllCardsByRarity,
            getAllMM2CardsByRarity: getAllMM2CardsByRarity,
            getAllFRFCardsByRarity: getAllFRFCardsByRarity,
            getAllKTKCardsByRarity: getAllKTKCardsByRarity,
            getAllDTKCardsByRarity: getAllDTKCardsByRarity,
            getAllM15CardsByRarity: getAllM15CardsByRarity,
            getAllTHSCardsByRarity: getAllTHSCardsByRarity,
            getAllJOUCardsByRarity: getAllJOUCardsByRarity,
            getAllORICardsByRarity: getAllORICardsByRarity,
            getAllBFZCardsByRarity: getAllBFZCardsByRarity,
            setDisplayCard: setDisplayCard,
            getDisplayCard: getDisplayCard,
            openXCardBoostersForLatestSet: openXCardBoostersForLatestSet,
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

        function copyCard(card) {
            this.Name = card.Name,
            this.Cost = card.Cost,
            this.Color = card.Color,
            this.Rarity= card.Rarity,
            this.Type= card.Type,
            this.Rating= card.Rating,
            this.Sort= card.Sort,
            this.Set= card.Set,
            this.Number= card.Number,
            this.Image= card.Image
        }

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

        function openMixtureOfSeededBoosters(numTHSBoosters, numBNGBoosters, numJOUBoosters, numCoreSetBoosters, numKTKBoosters, numFRFBoosters, numDTKBoosters, numMM2Boosters, numORIBoosters, numBFZBoosters, seedColor) {
            var chosenCards = openBoostersNoPromise(numTHSBoosters, numBNGBoosters, numJOUBoosters, numCoreSetBoosters, numKTKBoosters, numFRFBoosters, numDTKBoosters, numMM2Boosters, numORIBoosters, numBFZBoosters - 1, 0);
            //Replace core set boosters with seeded boosters.
            var boostersToSeed = openXCardBoostersForLatestSet(1, seedColor);
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

        function openMixtureOfSortedBoosters(numTHSBoosters, numBNGBoosters, numJOUBoosters, numCoreSetBoosters, numKTKBoosters, numFRFBoosters, numDTKBoosters, numMM2Boosters, numORIBoosters, numBFZBoosters) {
            var chosenCards = openBoostersNoPromise(numTHSBoosters, numBNGBoosters, numJOUBoosters, numCoreSetBoosters, numKTKBoosters, numFRFBoosters, numDTKBoosters, numMM2Boosters, numORIBoosters, numBFZBoosters);
            return $q.when(chosenCards);

        }

        function openBoostersNoPromise(numTHSBoosters, numBNGBoosters, numJOUBoosters, numCoreSetBoosters, numKTKBoosters, numFRFBoosters, numDTKBoosters, numMM2Boosters, numORIBoosters, numBFZBoosters)
        {
            var cardsBNG = openXBNGBoosters(numBNGBoosters);
            sortCards(cardsBNG);

            var cardsTHS = openXTHSBoosters(numTHSBoosters);
            sortCards(cardsTHS);

            var cardsJOU = openXJOUBoosters(numJOUBoosters);
            sortCards(cardsJOU);

            var cardsCore = openXCoreBoosters(numCoreSetBoosters);
            sortCards(cardsCore);

            var cardsKTK = openXKTKBoosters(numKTKBoosters);
            sortCards(cardsKTK);

            var cardsFRF = openXFRFBoosters(numFRFBoosters);
            sortCards(cardsFRF);

            var cardsDTK = openXDTKBoosters(numDTKBoosters);
            sortCards(cardsDTK);

            var cardsMM2 = openXMM2Boosters(numMM2Boosters);
            sortCards(cardsMM2);

            var cardsORI = openXORIBoosters(numORIBoosters);
            sortCards(cardsORI);

            console.log('num bfz' + numBFZBoosters)
            var cardsBFZ = openXBFZBoosters(numBFZBoosters);
            sortCards(cardsBFZ);

            combineCardArrays(cardsBNG, cardsTHS);
            combineCardArrays(cardsBNG, cardsJOU);
            combineCardArrays(cardsBNG, cardsCore);
            combineCardArrays(cardsBNG, cardsKTK);
            combineCardArrays(cardsBNG, cardsFRF);
            combineCardArrays(cardsBNG, cardsDTK);
            combineCardArrays(cardsBNG, cardsMM2);
            combineCardArrays(cardsBNG, cardsORI);
            combineCardArrays(cardsBNG, cardsBFZ);

            return cardsBNG;
        }

        function sortCards(array) {
            array.mythicCards.sort(cardSort);
            array.rareCards.sort(cardSort);
            array.uncommonCards.sort(cardSort);
            array.commonCards.sort(cardSort);
        }

        function combineCardArrays(array1, array2) {
            array1.mythicCards.push.apply(array1.mythicCards, array2.mythicCards);
            array1.rareCards.push.apply(array1.rareCards, array2.rareCards);
            array1.uncommonCards.push.apply(array1.uncommonCards, array2.uncommonCards);
            array1.commonCards.push.apply(array1.commonCards, array2.commonCards);
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
            var chanceOfFetchLand = 1 / 22;
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
            var selectedCards = openXCardBoosters(numBoosters, cards);
            return addFoilCards(DTK, selectedCards, numBoosters, true,  1 / 6);
        }

        function addFoilCards(setVar, selectedCards, numBoosters, swapOutCommon, chance) {
            for (var i = 0; i < numBoosters; i++) {
                if (Math.random() < chance) {
                    if (swapOutCommon) {
                        selectedCards.commonCards.pop();
                    }

                    var item = new copyCard(setVar[Math.floor(Math.random() * setVar.length)]);
                    item.isFoil = true;
                    if (item.Rarity == 'C') {
                        selectedCards.commonCards.push(item);
                    }
                    else if (item.Rarity == 'U') {
                        selectedCards.uncommonCards.push(item);
                    }
                    else if (item.Rarity == 'R') {
                        selectedCards.rareCards.push(item);
                    }
                    else if (item.Rarity == 'M') {
                        selectedCards.mythicCards.push(item);
                    }

                }
            }
            return selectedCards;
        }

        function openXBFZBoosters(numBoosters) {
            var cards = getAllBFZCardsSortedByRarity();
            var selectedCards = openXCardBoosters(numBoosters, cards);
            selectedCards = addFoilCards(BFZ, selectedCards, numBoosters, true, 1 / 6);
            return selectedCards;
        }

        function openXORIBoosters(numBoosters) {
            var cards = getAllORICardsSortedByRarity();
            var selectedCards = openXCardBoosters(numBoosters, cards);

            selectedCards = addFoilCards(ORI, selectedCards, numBoosters, true, 1/6);

            return selectedCards;
        }

        function openXMM2Boosters(numBoosters) {
            var cards = getAllMM2CardsSortedByRarity();
            var selectedCards = openXCardBoosters(numBoosters, cards);
            
            selectedCards = addFoilCards(MM2, selectedCards, numBoosters, false, 1);
            
            return selectedCards;
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

        function openXCardBoostersForLatestSet(numBoosters, color) {
            var cards = getAllBFZCardsSortedByRarity();
            var boostersToSeed = openXCardBoostersForColor(1, cards, color);
            return boostersToSeed;
        }

        function openXCardBoostersForColor(numBoosters, cards, color) {
            var selectedCards = new Cards();
            for (var i = 0; i < numBoosters; i++) {
                var boosterCards = openBoosterForColor(cards, selectedCards, color);
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
            var cardSet = DTK;
            if (Math.random() > 7 / 8) {
                switch (clan) {
                    case "W":
                        return cardSet[217 - 1];
                        break;
                    case "U":
                        return cardSet[219 - 1];
                        break;
                    case "B":
                        return cardSet[220 - 1];
                        break;
                    case "R":
                        return cardSet[218 - 1];
                        break;
                    case "G":
                        return cardSet[216 - 1];
                        break;
                }
            } else {
                var cardsToUse;
                switch (clan) {
                    case "W":
                        cardsToUse = [2, 3, 19, 23, 41, 175, 209, 212, 221];
                        break;
                    case "U":
                        cardsToUse = [26, 30, 47, 58, 61, 80, 227, 228];
                        break;
                    case "B":
                        cardsToUse = [70, 92, 96, 120, 121, 226, 232];
                        break;
                    case "R":
                        cardsToUse = [88, 112, 141, 162, 169, 214, 224];
                        break;
                    case "G":
                        cardsToUse = [132, 181, 187, 210, 213, 223];
                        break;
                }
                var cardNumberToGet = cardsToUse[Math.floor(Math.random() * cardsToUse.length)];
                return cardSet[cardNumberToGet - 1];
            }
        }

        function getSeededClanCardsCommonAndUncommons(clan, cardsSorted) {
            var possibleColors = [];
            var excludedCards = [];
            switch (clan) {
                case "W":
                    possibleColors = ["W", "G"];
                    excludedCards = [5, 20, 21, 27, 39, 172, 176, 190, 192, 4, 8, 11, 174, 183, 188, 208];
                    break;
                case "U":
                    possibleColors = ["U", "W"];
                    excludedCards = [10, 12, 15, 35, 37, 71, 76, 78, 84, 6, 9, 13, 14, 16, 22, 24, 33, 34, 40, 57, 69, 74];
                    break;
                case "B":
                    possibleColors = ["B", "U"];
                    excludedCards = [46, 75, 79, 83, 87, 89, 102, 53, 63, 66, 67, 68, 81, 82, 85, 107, 115];
                    break;
                case "R":
                    possibleColors = ["R", "B"];
                    excludedCards = [86, 108, 111, 114, 129, 134, 138, 149, 99, 105, 113, 118, 119, 122, 126, 127, 128, 139, 152];
                    break;
                case "G":
                    possibleColors = ["G", "R"];
                    excludedCards = [144, 146, 155, 159, 168, 184, 191, 198, 199, 201, 143, 145, 157, 170, 171, 189, 195, 200, 203];
                    break;
            }

            var clanCards = new Cards();

            var uncommonCards = cardsSorted.uncommonCards;
            var commonCards = cardsSorted.commonCards;

            for (var i = 0; i < 3; i++) {
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

            for (var i = 0; i < 10; i++) {
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
            console.log(singleColorCardSet);
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

            var booster = getSeededClanCardsCommonAndUncommons(color, allCards);//openBoostersNoPromise(0, 0, 0, 0, 1);
            clanCardSet.uncommonCards = booster.uncommonCards;
            clanCardSet.commonCards = booster.commonCards;

            return clanCardSet;
        }

        function openBoosterForColor(allCards, cardsArray, color)
        {
            var singleColorCardSet = new Cards();
            singleColorCardSet.commonCards = getCardsOfCertainColor(allCards.commonCards, color, 0);
            singleColorCardSet.uncommonCards = getCardsOfCertainColor(allCards.uncommonCards, color, 0);
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

            console.log(cards);
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

        function getAllMM2CardsByRarity() {
            return $q.when(getAllMM2CardsSortedByRarity())
        }
        function getAllMM2CardsSortedByRarity() {
            return sortCardSet(MM2);
        }

        function getAllDTKCardsByRarity() {
            return $q.when(getAllDTKCardsSortedByRarity())
        }
        function getAllDTKCardsSortedByRarity() {
            return sortCardSet(DTK);
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

        function getAllORICardsSortedByRarity() {
            return sortCardSet(ORI);
        }

        function getAllBFZCardsSortedByRarity() {
            return sortCardSet(BFZ);
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

        function getAllBFZCardsByRarity() {
            return $q.when(getAllBFZCardsSortedByRarity())
        }

        function getAllORICardsByRarity() {
            return $q.when(getAllORICardsSortedByRarity());
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