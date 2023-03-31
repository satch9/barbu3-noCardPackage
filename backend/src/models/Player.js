const _ = require('lodash');

class Player {
    constructor(username, socket = {}) {
        this.userneme = username;
        this.socket = socket;
        this.hand = [];
        this.score = 0;
    }
}

module.exports = Player;