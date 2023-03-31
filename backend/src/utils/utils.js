function getRoom(username, roomsExisting) {
    return _.find(roomsExisting, room => !room.finished && _.find(room.players, ['username', username]))
}

function broadcast(players, eventName, ...args) {
    _.map(players, player => {
        if (player.socket.emit) {
            player.socket.emit(eventName, ...args)
        }
    })
}

function isNewWinner(newCard, winningCard, trumpSuit) {
    if (!winningCard) {
        return true
    }

    if (newCard.suit == winningCard.suit) {
        return newCard.value > winningCard.value
    } else if (newCard.suit == trumpSuit) {
        return true
    }

    return false
}

function getTrickWinner(firstPlayer, trickCards, trumpSuit) {
    var trick = _.map(trickCards, Card.fromNumber)

    winningCard = _.first(trick)
    winningCardIndex = 0

    trick.slice(1).forEach((card, index) => {
        if (isNewWinner(card, winningCard, trumpSuit)) {
            winningCard = card
            winningCardIndex = index + 1
        }
    })

    return (winningCardIndex + firstPlayer) % 4
}

module.exports = {
    getRoom,
    broadcast,
    isNewWinner,
    getTrickWinner
}
