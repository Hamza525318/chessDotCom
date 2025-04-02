import {Game } from './Game';
import {User} from './User';
import {v4 as uuidv4} from 'uuid';


export class GameManager{

    games: Map<string, Game>

    constructor(){
        this.games = new Map();
    }

    addNewGame(player1: User,player2: User,gameId: string): Game{
        const newGame = new Game(player1,player2,gameId);
        this.games.set(gameId,newGame);

        return newGame;
    }

    getGameById(gameId: string): Game | undefined{
       if(this.games.has(gameId)){
        return this.games.get(gameId);
       }
    }

    findGameByPlayerId(userId: string): Game | undefined{
        for(const game of this.games.values()){
            if(game.player1.id == userId || game.player2.id == userId){
                return game;
            }
        }
    }
}