const _ = require('lodash');

class Deck {
    constructor() {
        this.cards = _.shuffle(_.range(52))
    }

    draw(n) {
        return n ? _.times(n, () => this.cards.pop()) : this.cards.pop()
    }
}

module.exports = Deck;