import { Color, PieceSymbol, Square } from "chess.js";
import { useState } from "react";

interface Move {
  from: string;
  to: string;
}

interface ChessBoardProps {
  board: ({ square: Square; type: PieceSymbol; color: Color } | null)[][];
  isPlayable: boolean; // Add the prop isPlayable to control if the pieces can be moved
}

function ChessBoard({ board, isPlayable }: ChessBoardProps) {
  const [move, setMove] = useState<Move>({ from: "", to: "" });
  const [highlighted, setHighlighted] = useState<string>(""); // Track highlighted square

  // Helper function to convert row and column indices to algebraic notation (e.g., 'a1', 'e5')
  const getSquareNotation = (i: number, j: number): string => {
    const letters = ["a", "b", "c", "d", "e", "f", "g", "h"];
    return `${letters[j]}${8 - i}`; // 8 - i because chess board rows are numbered from 1 to 8 (from top to bottom)
  };

  const handlePieceSelection = (i: number, j: number) => {
    const square = getSquareNotation(i, j);
    
    if (!isPlayable) return; // Don't allow piece selection if not playable

    if (!move.from) {
      setMove({ from: square, to: "" });
      setHighlighted(square); // Highlight the "from" square
    } else {
      setMove({ from: move.from, to: square });
      setHighlighted(""); // Remove highlight after selecting destination
    }
  };

  return (
    <div className="text-white">
      {board.map((row, i) => (
        <div key={i} className="flex justify-center items-center">
          {row.map((square, j) => {
            const squareNotation = getSquareNotation(i, j);
            const isHighlighted = squareNotation === highlighted;

            return (
              <div
                onClick={() => handlePieceSelection(i, j)} // Pass row and column to handle selection
                key={j}
                className={`w-16 h-16 ${
                  (i + j) % 2 === 0 ? "bg-green-600" : "bg-slate-50"
                } ${isHighlighted ? "border-4 border-yellow-400" : ""}`} // Highlight border
              >
                <div className="w-full h-full flex justify-center">
                  <div className="h-full justify-center flex flex-col">
                    {square && (
                      <img
                        className="w-8"
                        src={`/assets/${square.color}${square.type}.png`}
                        alt={`${square.color} ${square.type}`}
                      />
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

export default ChessBoard;
