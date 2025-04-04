"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupSocket = void 0;
const User_1 = require("./types/User");
const GameManager_1 = require("./types/GameManager");
const uuid_1 = require("uuid");
const redisClient_1 = __importDefault(require("./utils/redisClient"));
const gameModel_1 = __importDefault(require("./models/gameModel"));
const waitingQueue = [];
function setupSocket(io) {
    const gameManager = new GameManager_1.GameManager();
    io.on('connection', (socket) => {
        console.log("User connected");
        socket.on('init_game', (payload) => __awaiter(this, void 0, void 0, function* () {
            const { id, email } = payload;
            const newUser = new User_1.User(id, email, socket);
            waitingQueue.push(newUser);
            if (waitingQueue.length > 1) {
                waitingQueue.filter((user) => user.id === id);
                const player2 = waitingQueue.shift();
                if (!player2)
                    return;
                //create a new Game instance in Redis and DB and emit an event back to the User.
                const gameId = (0, uuid_1.v4)();
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
                    yield redisClient_1.default.set(`game:${gameId}`, JSON.stringify(gameData));
                    yield gameModel_1.default.insertOne(gameData);
                    socket.join(gameId);
                    player2.socket.join(gameId);
                    io.to(gameId).emit('match_found', {
                        gameId,
                        players: [
                            { id: newUser.id, email: newUser.email },
                            { id: player2.id, email: player2.email }
                        ]
                    });
                }
                catch (error) {
                    socket.emit("error", { message: "Error while finding match. Please retry!!" });
                }
            }
        }));
        socket.on('reconnect_game', (payload) => {
            const { userId } = payload;
            const IsPlayerexistedInGame = gameManager.findGameByPlayerId(userId);
            if (!IsPlayerexistedInGame)
                return;
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
            const opponent = player1 ? IsPlayerexistedInGame.player2 : IsPlayerexistedInGame.player1;
            opponent.socket.emit('opponent_reconnected', { id: player.id });
        });
        socket.on('disconnect', () => {
            console.log("User disconnected");
            // Optional: remove user from waitingQueue if needed
        });
    });
}
exports.setupSocket = setupSocket;
