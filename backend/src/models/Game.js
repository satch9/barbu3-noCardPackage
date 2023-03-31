const _ = require('lodash');
const { broadcast } = require('../utils/utils');

class Game{
    constructor(room){
        this.room = room
    }

    async startGame(){
        this.room.finished = false;
        this.room.dealer = -1;

        while(this.room.dealer < this.room.players.length -1 ) {
            this.room.dealer = this.room.dealer + 1;
            broadcast(this.room.players, 'dealer', this.room.dealer)

            this.room.playedContracts = _.times(6, ()=>false)
            broadcast(this.room.players, 'playedContracts', this.room.playedContracts);

            while(_.sum(this.room.playedContracts) < 6){
                let scores = await 
            }
        }

    }
}
