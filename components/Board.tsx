import React, { useState, useEffect } from 'react';
import Cell from './Cell';
import dynamic from 'next/dynamic';

// Dynamically import Confetti to avoid SSR issues
const Confetti = dynamic(() => import('react-confetti'), { ssr: false });

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
  getTurnText: () => string;
  getWinnerText: () => string;
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
  gameMode,
  getTurnText,
  getWinnerText 
}) => {
  const COLS = board[0].length;
  const EMPTY = null;
  const PLAYER1 = 'yellow';
  
  const getDisplayText = () => {
    if (winner) {
      if (gameMode === '1P') {
        return winner === PLAYER1 ? 'You won!' : 'AI won!';
      } else if (gameMode === 'AI') {
        return `AI ${winner === PLAYER1 ? '1' : '2'} won!`;
      } else {
        return `${winner === PLAYER1 ? 'Yellow' : 'Blue'} won!`;
      }
    }
    
    if (gameOver) {
      return "It's a draw!";
    }
    
    if (gameMode === '1P') {
      return currentPlayer === PLAYER1 ? "Your turn" : "AI's turn";
    } else if (gameMode === 'AI') {
      return `AI ${currentPlayer === PLAYER1 ? '1' : '2'}'s turn`;
    } else {
      return `${currentPlayer === PLAYER1 ? 'Yellow' : 'Blue'}'s turn`;
    }
  };
  
  const [windowDimension, setWindowDimension] = useState({ width: 0, height: 0 });
  const [showConfetti, setShowConfetti] = useState(false);
  
  useEffect(() => {
    // Set window dimensions for confetti
    setWindowDimension({
      width: window.innerWidth,
      height: window.innerHeight,
    });
    
    // Show confetti when there's a winner
    if (winner) {
      setShowConfetti(true);
      
      // Stop confetti after 5 seconds
      const timer = setTimeout(() => {
        setShowConfetti(false);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [winner]);
  
  return (
    <div className="flex flex-col items-center">
      {showConfetti && (
        <Confetti
          width={windowDimension.width}
          height={windowDimension.height}
          recycle={false}
          numberOfPieces={500}
          gravity={0.2}
          colors={winner === PLAYER1 ? 
            ['#fca000', '#fcb500', '#fcc800', '#fcd700'] : 
            ['#1f84c4', '#2294d4', '#25a4e4', '#28b4f4']}
        />
      )}
      
      <div className="text-2xl font-bold my-4">
        {getDisplayText()}
      </div>
      
      <div className="bg-gray-500 p-4 rounded-lg shadow-lg">
        {/* Column indicators */}
        <div className="flex justify-around sm:justify-between mb-2">
          {Array(COLS).fill(null).map((_, i) => (
            <div key={i} className="w-10 sm:w-14 flex justify-center">
              <button 
                className="text-3xl text-blue-200 hover:text-blue-400 cursor-pointer"
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
        className="mt-6 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-6 rounded cursor-pointer"
        onClick={goToMenu}
      >
        Back to Menu
      </button>
    </div>
  );
};

export default Board;