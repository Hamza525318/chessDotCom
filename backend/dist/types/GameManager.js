"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameManager = void 0;
const Game_1 = require("./Game");
class GameManager {
    constructor() {
        this.games = new Map();
    }
    addNewGame(player1, player2, gameId) {
        const newGame = new Game_1.Game(player1, player2, gameId);
        this.games.set(gameId, newGame);
        return newGame;
    }
    getGameById(gameId) {
        if (this.games.has(gameId)) {
            return this.games.get(gameId);
        }
    }
    findGameByPlayerId(userId) {
        for (const game of this.games.values()) {
            if (game.player1.id == userId || game.player2.id == userId) {
                return game;
            }
        }
    }
}
exports.GameManager = GameManager;
