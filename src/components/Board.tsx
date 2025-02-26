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
}

const Board: React.FC<BoardProps> = ({ 
  board, 
  currentPlayer, 
  winner, 
  gameOver, 
  animating, 
  handleColumnClick, 
  getAnimationStyle,
  goToMenu 
}) => {
  const COLS = board[0].length;
  const EMPTY = null;
  const PLAYER1 = 'red';

  return (
    <div className="flex flex-col items-center">
      <div className="text-2xl font-bold my-4">
        {winner ? 
          `Player ${winner === PLAYER1 ? '1' : '2'} won!` : 
          gameOver ? 
            "It's a draw!" : 
            `${currentPlayer === PLAYER1 ? 'Player 1' : 'Player 2'}'s turn`
        }
      </div>
      
      <div className="bg-blue-500 p-4 rounded-lg shadow-lg">
        {/* Column indicators */}
        <div className="flex justify-around mb-2">
          {Array(COLS).fill(null).map((_, i) => (
            <div key={i} className="w-12 flex justify-center">
              <button 
                className="text-blue-200 hover:text-white"
                onClick={() => handleColumnClick(i)}
                disabled={gameOver || animating || board[0][i] !== EMPTY}
              >
                ▼
              </button>
            </div>
          ))}
        </div>
        
        {/* Game board */}
        <div className="bg-blue-500 relative">
          {board.map((row, rowIdx) => (
            <div key={rowIdx} className="flex">
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