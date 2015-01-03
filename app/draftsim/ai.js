function ai(name) {
    this.name = name;
    this.cards = [];
    this.colors = [];
    this.boosterCards = [];
}


function processTurn(ai) {
    var cardToAdd;
    var cards = ai.boosterCards;
    if (ai.colors.length === 0) {
        cardToAdd = noColorsProcess(cards);
    } else if (ai.colors.length === 1) {
        cardToAdd = singleColorProcess(cards, ai);
    } else if (ai.colors.length === 2) {
        cardToAdd = twoColorProcess(cards, ai);
    } else {
        cardToAdd = standardProcess(cards, ai);
    }

    if (cardToAdd != null) {
        var index = ai.boosterCards.indexOf(cardToAdd);
        if (index > -1) {
            ai.boosterCards.splice(index, 1);
        }
        ai.cards.push(cardToAdd);

        if (ai.colors.length <= 3 - cardToAdd.Color.length) {
            cardToAdd.Color.forEach(function (color) {
                if (color !== "C" && ai.colors.indexOf(color) === -1) {
                    ai.colors.push(color);
                }
            });
        }
    }
       
}

/*Get the card with the highest rating*/
function noColorsProcess(cards) {
    var bestRate = 0;
    var bestNumber = 0;
    for (var i = 0; i < cards.length; i++) {
        var cardRating = parseInt(cards[i].Rating);
        if (cardRating > bestRate) {
            bestRate = cardRating;
            bestNumber = i;
        }
    }
    var pickedCard = cards[bestNumber];
    var pickedCardWithExtraConsiderations = additonalConsiderations(pickedCard, cards);
    return pickedCardWithExtraConsiderations;
}

/*Gets the card with the highest rating if it has a single color*/
function singleColorProcess(cards, ai) {
    var bestRate = 0;
    var bestNumber = 0;
    //Only one color.
    var color = ai.colors[0];
    for (var i = 0; i < cards.length; i++) {
        var cardRating = parseInt(cards[i].Rating);
        if (cardRating > bestRate
            && 
            (cards[i].Color.length <= 2 ||
            getNumberOfMatchingColors(cards[i], ai.colors) == 1)) {
            bestRate = cardRating;
            bestNumber = i;
        }
    }
    var pickedCard = cards[bestNumber];
    var pickedCardWithExtraConsiderations = additonalConsiderations(pickedCard, cards);
    return pickedCardWithExtraConsiderations;
}

function twoColorProcess(cards, ai) {
    var bestRate = 0;
    var bestNumber = 0;
    for (var i = 0; i < cards.length; i++) {
        var cardRating = parseInt(cards[i].Rating);
        if (cardRating > bestRate &&
            (cards[i].Color.length == 1 ||
            getNumberOfMatchingColors(cards[i], ai.colors) == 2)) {
            bestRate = cardRating;
            bestNumber = i;
        }
    }
    var pickedCard = cards[bestNumber];
    var pickedCardWithExtraConsiderations = additonalConsiderations(pickedCard, cards);
    return pickedCardWithExtraConsiderations;
}

/*Gets the card with the highest rating from the AIs chosen colors.*/
function standardProcess(cards, ai) {
    var bestRate = 0;
    var bestNumber = 0;
    for (var i = 0; i < cards.length; i++) {
        var cardRating = parseInt(cards[i].Rating);
        if (cardRating > bestRate &&
            (getNumberOfMatchingColors(cards[i], ai.colors) >= cards[i].Color.length)) {
            bestRate = cardRating;
            bestNumber = i;
        }
    }
    var pickedCard = cards[bestNumber];
    if (pickedCard == null) {
        return pickedCard;
    }
    var pickedCardWithExtraConsiderations = additonalConsiderations(pickedCard, cards);
    return pickedCardWithExtraConsiderations;
}

function additonalConsiderations(chosenCard, cardsList) {
    if (isRareOrMythic(chosenCard)) {
        return chosenCard;
    } else {
        //Pick another card if theres a mythic rare other which isnt the card picked.
        for (var i = 0; i < cardsList.length; i++) {
            var cardRating = parseInt(cardsList[i].Rating);
            if (cardRating > 4 && (isRareOrMythic(cardsList[i]))) {
                return cardsList[i];
            }
        }
        return chosenCard;
    }
}

function isRareOrMythic(card) {
    if (card.Rarity === "M" || card.Rarity === "R") {
        return true;
    }
    return false;
}


function arraysIdentical(a, b) {
    var i = a.length;
    if (i !== b.length) return false;
    while (i--) {
        if (a[i] !== b[i]) return false;
    }
    return true;
};

function getNumberOfMatchingColors(card, aisColors) {
    var numberOfMatches = 0;
    $.each(card.Color, function (index, value) {
        if (aisColors.indexOf(value) != -1) {
            numberOfMatches++;
        }
    });
    return numberOfMatches;
}