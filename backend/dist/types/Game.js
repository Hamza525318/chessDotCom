"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Game = void 0;
const chess_js_1 = require("chess.js");
class Game {
    constructor(player1, player2, gameId) {
        this.player1 = player1;
        this.player2 = player2;
        this.moves = [];
        this.startTime = new Date();
        this.gameId = gameId;
        this.board = new chess_js_1.Chess();
    }
    gameTimeOver() {
        const currentTime = new Date();
        const elapsedTime = currentTime.getTime() - this.startTime.getTime();
        const fifteenMinutesInSeconds = 15 * 60 * 1000;
        if (elapsedTime > fifteenMinutesInSeconds) {
            return true;
        }
        return false;
    }
    makeMove(player, move, io) {
        const { from, to } = move;
        //check if the turn is of current user
        if (this.gameTimeOver()) {
            io.to(this.gameId).emit("game_time_up", { message: "Game time has finished!! It is a draw" });
            return;
        }
        if (this.board.moves.length % 2 == 0 && player.socket !== this.player1.socket) {
            player.socket.emit("invalid_move", { message: "It is not your turn please wait for turn..." });
            return;
        }
        if (this.board.moves.length % 2 !== 0 && player.socket !== this.player2.socket) {
            player.socket.emit("invalid_move", { message: "It is not your turn please wait for turn..." });
            return;
        }
        //validate
        try {
            const currentMove = this.board.move({ from: from, to: to });
            this.moves.push({ from: from, to: to, piece: currentMove.piece, timestamp: new Date(), playerId: player.id });
        }
        catch (error) {
            player.socket.emit("invalid_move", { message: "Not a valid move. Please make a valid move!!" });
        }
        if (this.board.isDraw()) {
            io.to(this.gameId).emit("draw_game", { message: "The game has ended in Draw!!" });
        }
        if (this.board.isGameOver()) {
            io.to(this.gameId).emit("game_over", { winner: this.board.turn() == 'w' ? this.player2 : this.player1, message: `
            Player ${this.board.turn() == 'w' ? this.player2.email : this.player1.email} has won the game` });
        }
        //send the updated board to both players
    }
}
exports.Game = Game;
