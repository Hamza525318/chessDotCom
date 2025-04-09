import {Game } from './Game';
import {User} from './User';
import {v4 as uuidv4} from 'uuid';
import { Server, Socket } from 'socket.io';


export class GameManager{

    games: Map<string, Game>
    io: Server

    constructor(io: Server) {
        this.games = new Map();
        this.io = io;
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

    gameHandler(socket: Socket){
        
        socket.on('make_move',(payload:{gameId: string,from: string,to: string})=>{

           const {gameId,from,to} = payload;
           const game = this.getGameById(gameId);
           if(!game) return;
           const currPlayer: User = socket.id === game?.player1.socket.id ? game.player1 : game.player2;

           game.makeMove(currPlayer,{from:from,to:to},this.io);
        }) 
    }
}