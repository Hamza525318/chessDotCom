import mongoose from 'mongoose';

const moveSchema = new mongoose.Schema({
    from: String,
    to: String,
    piece: String,
    timestamp: Date,
    playerId: String,
})

const gameSchema = new mongoose.Schema({
    player1: String,
    player2: String,
    gameId: String,
    moves: [moveSchema],
    gameStart: {type:Date,default: Date.now},
    status: {type: String,default: 'ongoing'},
    winner: {type: String,default: null},
    board: String
});

const gameModel = mongoose.model('chessGame',gameSchema);

export default gameModel;