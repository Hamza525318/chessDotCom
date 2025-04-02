"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const moveSchema = new mongoose_1.default.Schema({
    from: String,
    to: String,
    piece: String,
    timestamp: Date,
    playerId: String,
});
const gameSchema = new mongoose_1.default.Schema({
    player1: String,
    player2: String,
    gameId: String,
    moves: [moveSchema],
    gameStart: { default: Date.now },
    status: { type: String, default: 'ongoing' },
    winner: { type: String, default: null }
});
const gameModel = mongoose_1.default.model('chessGame', gameSchema);
exports.default = gameModel;
