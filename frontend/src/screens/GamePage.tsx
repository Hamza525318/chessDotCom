import { useSocketContext } from "../hooks/useSocketContext";
import { useUserContext } from "../hooks/userContext";
import { useState } from "react";
import ChessBoard from "../components/ChessBoard";
import { Chess, Piece } from "chess.js";
import { useLocation } from "react-router";
import { Square,PieceSymbol,Color } from "chess.js";

interface GameState {
  gameId: string;
  players: { id: string; email: string }[];
  board: ({square: Square,type: PieceSymbol,color: Color} | null)[][]
}

export default function UserGamePage() {
  const { socket } = useSocketContext();
  const { user } = useUserContext();
  const location = useLocation();
  console.log("GAME START",location.state);
  console.log("SOCKET CONNECTION--->>>",socket?.id);
  const { gameId, players, board } = location.state as GameState || { gameId: "", players: [], board: new Chess() }; // Default fallback if state is null

  // Initialize the state for chessboard with the board method
  const [chessBoard, setChessBoard] = useState(board); // Use board() to get the actual board state

  // Optionally, you could handle other game logic here
  
  return (
    <div className="w-screen h-screen bg-slate-800 mx-auto flex justify-center items-center">
      <div className="w-full flex flex-col md:flex-row items-center px-4 my-6 gap-8">
        <div className="w-full md:w-1/2 flex justify-end">
          {/* Pass chessBoard state to ChessBoard */}
          <ChessBoard board={chessBoard} />
        </div>
        <div className="w-full md:w-1/2 text-center md:text-left md:px-4">
          <h3 className="text-2xl font-semibold text-white">Game Moves</h3>
          <ul className="text-white text-xl">
            <li>Player 1: e4-b4</li>
            <li>Player 1: e4-b4</li>
            <li>Player 1: e4-b4</li>
            <li>Player 1: e4-b4</li>
            <li>Player 1: e4-b4</li>
            <li>Player 1: e4-b4</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
