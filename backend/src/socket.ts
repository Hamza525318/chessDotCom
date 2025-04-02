import { Server, Socket } from 'socket.io';
import { User } from './types/User';
import {GameManager} from './types/GameManager'
import {v4 as uuidv4} from 'uuid';
import redisClient from './utils/redisClient';
import gameModel from './models/gameModel';


const waitingQueue: User[] = [];


export function setupSocket(io: Server) {
    const gameManager = new GameManager();
  io.on('connection', (socket: Socket) => {
    

    socket.on('init_game', async(payload: { id: string; email: string }) => {
      const { id, email } = payload;
      const newUser = new User(id, email, socket);

      if(waitingQueue.length > 1){
        const player2 = waitingQueue.shift();

        if(!player2) return;


        //create a new Game instance in Redis and DB and emit an event back to the User.
        const gameId = uuidv4();
        gameManager.addNewGame(newUser,player2,gameId);

        const gameData = {
            id: gameId,
            player1: newUser.id,
            player2: player2.id,
            moves: [],
            status: 'ongoing',
            startTime: new Date().toISOString()
        };

        try{

            await redisClient.set(`game:${gameId}`, JSON.stringify(gameData));
            await gameModel.insertOne(gameData);

            socket.join(gameId);

            player2.socket.join(gameId);
            io.to(gameId).emit('match_found', {
                gameId,
                players: [
                  { id: newUser.id, email: newUser.email },
                  { id: player2.id, email: player2.email }
                ]
            })

        }catch(error){

            socket.emit("error",{message: "Error while finding match. Please retry!!"})
        }
    }

      console.log(`User added to queue: ${id} (${email})`);
    });

    socket.on('reconnect_game',(payload: {userId: string})=>{

        const {userId} = payload;
        const IsPlayerexistedInGame = gameManager.findGameByPlayerId(userId);

        if(!IsPlayerexistedInGame) return;

        const player1 = IsPlayerexistedInGame.player1.id === userId;
        const player = player1 ? IsPlayerexistedInGame.player1 : IsPlayerexistedInGame.player2;

        player.socket = socket;

        socket.join(IsPlayerexistedInGame.gameId);
        socket.emit('reconnected', {
            gameId: IsPlayerexistedInGame.gameId,
            opponent: player1 ? IsPlayerexistedInGame.player2.id : IsPlayerexistedInGame.player1.id,
            moves: IsPlayerexistedInGame.moves,
            youAre: player1 ? 'white' : 'black'
          });
      
          // Optionally notify the opponent
          const opponent = player1 ?IsPlayerexistedInGame.player2 : IsPlayerexistedInGame.player1;
          opponent.socket.emit('opponent_reconnected', { id: player.id });
        
    })

    socket.on('disconnect', () => {
      console.log("User disconnected");
      // Optional: remove user from waitingQueue if needed
    });
  });
}
