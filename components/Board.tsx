import React from 'react';
import Cell from './Cell';

interface BoardProps {
  board: (string | null)[][];
  currentPlayer: string;
  winner: string | null;
  gameOver: boolean;
  animating: boolean;
  handleColumnClick: (colIdx: number) => void;
  getAnimationStyle: (rowIdx: number, colIdx: number) => React.CSSProperties;
  goToMenu: () => void;
  gameMode: string | null;
}

const Board: React.FC<BoardProps> = ({ 
  board, 
  currentPlayer, 
  winner,
  gameOver,
  animating,
  handleColumnClick,
  getAnimationStyle,
  goToMenu,
  gameMode 
}) => {
  const COLS = board[0].length;
  const EMPTY = null;
  const PLAYER1 = 'yellow';
  const getTurnText = () => {
    if (gameMode === '1P') {
      return currentPlayer === PLAYER1 ? "Your turn" : "AI's turn";
    }
    return `${currentPlayer === PLAYER1 ? 'Yellow' : 'Blue'}'s turn`;
  };
  
  return (
    <div className="flex flex-col items-center">
      <div className="text-2xl font-bold my-4">
        {winner ? 
          `${gameMode === '1P' ? 
            (winner === PLAYER1 ? 'You' : 'AI') : 
            (winner === PLAYER1 ? 'Yellow' : 'Blue')} won!` : 
          gameOver ? 
            "It's a draw!" : 
            getTurnText()
        }
      </div>
      
      <div className="bg-gray-500 p-4 rounded-lg shadow-lg">
        {/* Column indicators */}
        <div className="flex justify-around sm:justify-between mb-2">
          {Array(COLS).fill(null).map((_, i) => (
            <div key={i} className="w-10 sm:w-14 flex justify-center">
              <button 
                className="text-blue-200 hover:text-white cursor-pointer"
                onClick={() => handleColumnClick(i)}
                disabled={gameOver || animating || board[0][i] !== EMPTY}
              >
                ▼
              </button>
            </div>
          ))}
        </div>
        
        {/* Game board */}
        <div className="bg-gray-500 relative">
          {board.map((row, rowIdx) => (
            <div key={rowIdx} className="flex sm:gap-3">
              {row.map((cell, colIdx) => (
                <Cell 
                  key={`${rowIdx}-${colIdx}`}
                  rowIdx={rowIdx}
                  colIdx={colIdx}
                  cell={cell}
                  handleColumnClick={handleColumnClick}
                  getAnimationStyle={getAnimationStyle}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
      
      <button 
        className="mt-6 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-6 rounded"
        onClick={goToMenu}
      >
        Back to Menu
      </button>
    </div>
  );
};

export default Board;