import {User} from './User';

interface Move{
    from: string,
    to: string,
    piece: string,
    timestamp: Date,
    playerId: string
}

export class Game{
    gameId: string
    player1: User;
    player2: User;
    moves: Move[];
    startTime: Date;

    constructor(player1: User,player2: User,gameId: string){

        this.player1 = player1;
        this.player2 = player2;
        this.moves  = [];
        this.startTime = new Date();
        this.gameId = gameId;
    }
}