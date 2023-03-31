const { reject } = require('lodash');
const _ = require('lodash');
const { broadcast, getTrickWinner } = require('../utils/utils');
const Card = require('./Cards');

class Contract {
    constructor(dealer, contract) {
        this.dealer = dealer;
        this.contract = contract;
        this.firstPlayer = 0;
        this.currentPlayer = 0;
        this.trickCards = [];

        this.trumpSuit = null; // pour la couleur

        this.startingValue = null; // pour la réusite
        this.reussite = {
            'Hearts': {
                ace: false,
                cards: []
            },
            'Diamonds': {
                ace: false,
                cards: []
            },
            'Clubs': {
                ace: false,
                cards: []
            },
            'Spades': {
                ace: false,
                cards: []
            },
        };
        this.points = [];

        this.hearts = null; // pour pas de coeur
        this.queen = null; // pour pas de dame

        this.players = [];
        this.scores = _.times(4, () => 0);
        this.terminal = false;

    }

    validate(card) {
        if (!this.trickCards.length) {
            return true;
        }
        let trick = _.map(this.trickCards, Card.fromNumber);
        let hand = _map(this.players[this.currentPlayer].hand, Card.fromNumber);

        if (!_.filter(hand, (card) => card === _.first(trick).suit).length) {
            return true;
        }
        return Card.fromNumber(card).suit === _.first(trick).suit;
    }

    async play(players) {
        this.players = players;
        let playedCard;
        while (!this.terminal) {
            broadcast(this.players, 'currentPlayer', this.currentPlayer);

            // Demandez au joueur actuel une carte
            do {
                playedCard = await new Promise((resolve, reject) => {
                    this.players[this.currentPlayer].socket.emit('turn', (response) => {
                        resolve(response);
                    });
                })
            } while (playedCard === undefined);

            // Validez la carte jouée
            if (this.validate(playedCard)) {

                //Enlever la carte jouée de la main du joueur
                _.remove(this.players[this.currentPlayer].hand, (card) => card === playedCard);

                // Ajouter la carte jouée au pli
                this.trickCards.push(playedCard);

                // Mettre à jour la main du joueur dans le client
                broadcast(this.players[this.currentPlayer], 'hand', this.players[this.currentPlayer].hand);

                broadcast(this.players, 'firstPlayer', this.firstPlayer);
                broadcast(this.players, 'trickCards', this.trickCards);

                // fin du pli
                if (this.trickCards.length === 4) {

                    // Déterminer le vainqueur du pli et mise à jour du premier/actuel joueur du pli
                    this.firstPlayer = getTrickWinner(this.firstPlayer, this.trickCards, this.trumpSuit);
                    this.currentPlayer = this.firstPlayer;

                    // Mettre à jour les scores basé sur le gagnant du pli et les cartes du pli (pour le contrat)
                    this.updateScores();

                    broadcast(this.players, 'log', this.players[this.currentPlayer].username + ' a gagné le pli!\n')

                    this.trickCards = [];
                } else {
                    this.currentPlayer = (this.currentPlayer + 1) % 4;
                }

                // si tout le monde a joué l'etat est terminal
                if (!_.flatten(_.map(players, 'hand')).length) {
                    this.terminal = true;
                }
            } else {
                broadcast(this.players[this.currentPlayer], 'log', 'Vous ne pouvez pas jouer cette carte!\n');
            }

        }

        return this.scores;
    }
}

class PasDePlis extends Contract {
    constructor(dealer) {
        super(dealer, 0);
    }

    updateScores() {
        this.scores[this.currentPlayer] += 5;
    }
}

class PasDeCoeur extends Contract {
    constructor(dealer) {
        super(dealer, 1);
        this.hearts = 0;
    }

    validate(card) {
        let trick = _map(this.trickCards, Card.fromNumber);
        let hand = _map(this.players[this.currentPlayer].hand, Card.fromNumber);

        if (!this.trickCards.length) {
            if (_.some(hand, (card) => card.suit === 'Hearts')) {
                return Card.fromNumber(card).suit !== 'Hearts';
            }
            return true;
        }

        if (!_.filter(hand, (card) => card.suit === _.first(trick).suit).length) {
            return true;
        }

        return Card.fromNumber(card).suit === _.first(trick).suit;
    }

    updateScores() {
        _.each(_.map(this.trickCards, Card.fromNumber), (card) => {
            if (card.suit === 'Hearts') {
                this.hearts++;
                this.scores[this.currentPlayer] += 5;
            }
        });
        if (this.hearts == 13) {
            this.terminal = true;
        }
    }
}

class Barbu extends Contract {
    constructor(dealer) {
        super(dealer, 2);
    }

    validate(card) {
        let trick = _map(this.trickCards, Card.fromNumber);
        let hand = _map(this.players[this.currentPlayer].hand, Card.fromNumber);

        if (!this.trickCards.length) {
            if (_.some(hand, (card) => card.suit === 'Hearts')) {
                return Card.fromNumber(card).suit !== 'Hearts';
            }
            return true;
        }

        if (!_.filter(hand, (card) => card.suit === _.first(trick).suit).length) {
            return true;
        }

        return Card.fromNumber(card).suit === _.first(trick).suit;
    }

    updateScores() {
        _.each(this.trickCards, (card) => {
            if (card.suit === 11) {
                this.scores[this.currentPlayer] += 70;
                this.terminal = true;
            }
        });
    }
}

class PasDeDame extends Contract {
    constructor(dealer) {
        super(dealer, 3);
        this.queen = 0;
    }

    updateScores() {
        const queens = [10, 23, 36, 49];

        _.each(this.trickCards, (card) => {
            if (_.includes(queens, card)) {
                this.queen++;
                this.scores[this.currentPlayer] += 15;
            }
        });

        if (this.queen === 4) {
            this.terminal = true;
        }
    }
}

class Reussite extends Contract {
    constructor(dealer) {
        super(dealer, 4);
        this.reussite = {
            'Hearts': {
                ace: false,
                cards: []
            },
            'Diamonds': {
                ace: false,
                cards: []
            },
            'Clubs': {
                ace: false,
                cards: []
            },
            'Spades': {
                ace: false,
                cards: []
            },
        };
        this.points = [-100, -50, 0, 0]
    }

    validate(card) {
        let playedCard = Card.fromNumber(card);

        if (playedCard.value == this.startingValue) {
            return true;
        }

        let suitCards = _.map(this.reussite[playedCard.suit].cards, Card.fromNumber);

        if (playedCard.value == 12) {
            return _.get(_.first(suitCards), 'value') == 0;
        }

        if (playedCard.value == 0 && this.reussite[playedCard.suit].ace) {
            return true;
        }

        if ((playedCard.value == _.get(_.first(suitCards), 'value') - 1)
            || (playedCard.value == _.get(_.last(suitCards), 'value') + 1)) {
            return true;
        }

        return false;

    }

    attachCard(card) {
        let playedCard = Card.fromNumber(card);
        if (playedCard.value == 12) {
            this.reussite[playedCard.suit].ace = true;
        } else {
            this.reussite[playedCard.suit].cards
                = _.chain(this.reussite[playedCard.suit].cards)
                    .concat(card)
                    .sortBy()
                    .value();
        }
    }

    canPlay(playerIndex) {
        return _.some(this.players[playerIndex].hand, (card) => this.validate(card), Boolean);
    }

    async play(players) {
        this.players = players

        // In reussite, the first player is the one after the dealer
        this.currentPlayer = (this.currentPlayer + 1) % 4

        while (!this.terminal) {
            broadcast(this.players, 'currentPlayer', this.currentPlayer)

            // Check if the current player can play a card
            // If they can't, automatically pass the turn
            if (this.canPlay(this.currentPlayer)) {
                let playedCard
                // Ask current player for a card
                do {
                    playedCard = await new Promise((resolve, reject) => {
                        this.players[this.currentPlayer].socket.emit('turn', response => {
                            resolve(response)
                        })
                    })
                } while (playedCard === undefined)

                // Validate played card
                if (this.validate(playedCard)) {

                    // Remove played card from the player's hand
                    _.remove(this.players[this.currentPlayer].hand, card => card == playedCard)

                    // Attach card to reussite
                    this.attachCard(playedCard)

                    // Update player's hand in the client
                    this.players[this.currentPlayer].socket.emit('hand', this.players[this.currentPlayer].hand)

                    // If the player has an empty hand, give them the highest available score
                    if (!this.players[this.currentPlayer].hand.length) {
                        this.scores[this.currentPlayer] = this.points.shift()
                    }

                    this.currentPlayer = (this.currentPlayer + 1) % 4

                    broadcast(this.players, 'reussite', this.reussite)

                    // If everyone has an empty hand, the state is terminal
                    if (!_.flatten(_.map(players, 'hand')).length) {
                        this.terminal = true
                    }

                } else {
                    this.players[this.currentPlayer].socket.emit('log', 'Card not valid.')
                }

            } else {

                _.map(this.players, player => {
                    if (player.socket.emit) {
                        player.socket.emit('log', this.players[this.currentPlayer].username + ' passed!')
                    }
                })
                this.currentPlayer = (this.currentPlayer + 1) % 4

            }
        }

        return this.scores
    }
}

function createContract(contract) {
    const contracts = [
        PasDePlis,
        PasDeCoeur,
        Barbu,
        PasDeDame,
        Reussite,
    ]

    return new contracts[contract]
}

module.exports = {
    Contract,
    PasDePlis,
    PasDeCoeur,
    Barbu,
    PasDeDame,
    Reussite,
    createContract,
};