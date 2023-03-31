const _ = require('lodash');

class Room {
    constructor(name) {
        this.name = name;

        this.players = [];
        this.contract = null;

        this.history = _.times(4, () => [0]);
        this.dealer = null;
        this.playedContract = _.times(7, () => false);

        this.finished = false;
    }
}

module.exports = Room;