function ai(name) {
    this.name = name;
    this.cards = [];
    this.colors = [];
    this.boosterCards = [];
}

function processTurn(ai) {
    var cardToAdd;
    var cards = ai.boosterCards;
    if (ai.colors.length == 0)
    {
        cardToAdd = noColorsProcess(cards);
    }
    else if (ai.colors.length == 1)
    {
        cardToAdd = singleColorProcess(cards, ai);
    }
    else
    {
        cardToAdd = standardProcess(cards, ai);
    }

    var index = ai.boosterCards.indexOf(cardToAdd);
    if (index > -1) {
        ai.boosterCards.splice(index, 1);
    }
    ai.cards.push(cardToAdd);

    //AIs only choose 2 colors.
    if (ai.colors.length < 2)
    {
        cardToAdd.Color.forEach(function (color) {
            if (color != "C" && ai.colors.indexOf(color) == -1) {
                ai.colors.push(color);
            }
        });
    }
       
}

/*Get the card with the highest rating*/
function noColorsProcess(cards) {
    var bestRate = 0;
    var bestNumber = 0;
    for (var i = 0; i < cards.length; i++) {
        if (cards[i].Rating > bestRate) {
            bestRate = cards[i].Rate;
            bestNumber = i;
        }
    }
    return cards[bestNumber];
}

/*Gets the card with the highest rating if it has a single color*/
function singleColorProcess(cards, ai) {
    var bestRate = 0;
    var bestNumber = 0;
    //Only one color.
    var color = ai.colors[0];
    for (var i = 0; i < cards.length; i++) {
        if (cards[i].Color.length == 1 && cards[i].Color[0] == color && cards[i].Rating > bestRate) {
            bestRate = cards[i].Rating;
            bestNumber = i;
        }
    }
    return cards[bestNumber];
}

/*Gets the card with the highest rating from the AIs chosen colors.*/
function standardProcess(cards, ai) {
    
    var bestRate = 0;
    var bestNumber = 0;
    var color1 = ai.colors[0];
    var color2 = ai.colors[1];
    for (var i = 0; i < cards.length; i++) {
        var acceptableCard = true;

        if (cards[i].Color.length == 2 && !arraysIdentical(ai.colors, cards[i].Color))
        {
            acceptableCard = false;
        }
        else if (cards[i].Color.indexOf(color1) == -1 && cards[i].Color.indexOf(color2) == -1)
        {
            acceptableCard = false;
        }

        if (acceptableCard && cards[i].Rating > bestRate) {
            bestRate = cards[i].Rating;
            bestNumber = i;
        }
    }
    return cards[bestNumber];
}

function arraysIdentical(a, b) {
    var i = a.length;
    if (i != b.length) return false;
    while (i--) {
        if (a[i] !== b[i]) return false;
    }
    return true;
};