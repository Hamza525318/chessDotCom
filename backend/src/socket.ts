import { Server, Socket } from 'socket.io';
import { User } from './types/User';
import {GameManager} from './types/GameManager'
import {v4 as uuidv4} from 'uuid';
import redisClient from './utils/redisClient';
import gameModel from './models/gameModel';


const waitingQueue: User[] = [];


export function setupSocket(io: Server) {
  const gameManager = new GameManager(io);
  io.on('connection', (socket: Socket) => {
     
    console.log("User connected")

    socket.on('init_game', async (payload: any) => {
        console.log("Received payload:", payload);
        console.log("Type of payload:", typeof payload);  // Check the type here
      
        if (typeof payload === "string") {
          try {
            payload = JSON.parse(payload);  // If it's a string, parse it into an object
          } catch (error) {
            console.error("Invalid JSON string:", error);
            return;
          }
        }
      
        const { id, email } = payload;
        console.log("Game request from user", payload);
      
        const newUser = new User(id, email, socket);
        waitingQueue.push(newUser);
      
        if (waitingQueue.length > 1) {
          waitingQueue.filter((user: User) => user.id === id);
          const player2 = waitingQueue.shift();
          console.log("Player 2", player2);
          if (!player2) return;
      
          const gameId = uuidv4();
          gameManager.addNewGame(newUser, player2, gameId);
      
          const gameData = {
            id: gameId,
            player1: newUser.id,
            player2: player2.id,
            moves: [],
            status: 'ongoing',
            startTime: new Date().toISOString()
          };
      
          try {
            await redisClient.set(`game:${gameId}`, JSON.stringify(gameData)).then(() => {
              console.log("Inserted game in Redis");
            });
            await gameModel.insertOne(gameData);
      
            socket.join(gameId);
            player2.socket.join(gameId);
            io.to(gameId).emit('start_game', {
              gameId,
              players: [
                { id: newUser.id, email: newUser.email },
                { id: player2.id, email: player2.email }
              ],
              board: gameManager.getGameById(gameId)?.board.board()
            });
      
          } catch (error) {
            socket.emit("error", { message: "Error while finding match. Please retry!!" });
          }
        }
      });
      ;

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
