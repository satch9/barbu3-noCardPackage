const _ = require('lodash');

class Card {
    constructor(value, suit) {
        this.value = value;
        this.suit = suit;
    }

    static suits = ['Hearts', 'Diamonds', 'Clubs', 'Spades']
    static symbols = ['♥', '♦', '♣', '♠']

    static values = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
    static labels = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A']

    static fromNumber(n) {
        return n > 51
            ? null
            : new Card(
                Card.suits[Math.trunc(n / 13)],
                n % 13
            )
    }

    toString() {
        return Card.symbols[_.indexOf(Card.suits, this.suit)] + Card.labels[this.value]
    }
}

module.exports = Card;