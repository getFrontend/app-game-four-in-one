"use client";

import React, { useState, useEffect } from 'react';
import Board from './Board';
import Menu from './Menu';

const ConnectFour: React.FC = () => {
  const ROWS = 6;
  const COLS = 7;
  const EMPTY = null;
  const PLAYER1 = 'red';
  const PLAYER2 = 'yellow';

  const [board, setBoard] = useState<(string | null)[][]>(createEmptyBoard());
  const [currentPlayer, setCurrentPlayer] = useState<string>(PLAYER1);
  const [gameMode, setGameMode] = useState<string | null>(null);
  const [winner, setWinner] = useState<string | null>(null);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [animating, setAnimating] = useState<boolean>(false);
  const [dropAnimation, setDropAnimation] = useState<{
    active: boolean;
    col: number | null;
    row: number | null;
    player: string | null;
  }>({ active: false, col: null, row: null, player: null });

  // Create an empty board
  function createEmptyBoard() {
    return Array(ROWS).fill(null).map(() => Array(COLS).fill(EMPTY));
  }

  // Handle column click
  const handleColumnClick = (colIndex: number) => {
    if (gameOver || animating) return;
    
    // Find the lowest empty cell in the column
    let rowIndex = -1;
    for (let r = ROWS - 1; r >= 0; r--) {
      if (board[r][colIndex] === EMPTY) {
        rowIndex = r;
        break;
      }
    }
    
    // Column is full
    if (rowIndex === -1) return;
    
    // Start drop animation
    setAnimating(true);
    setDropAnimation({
      active: true,
      col: colIndex,
      row: rowIndex,
      player: currentPlayer
    });
    
    // Create temporary board for animation
    const tempBoard = [...board];
    tempBoard[0][colIndex] = currentPlayer;
    setBoard(tempBoard);
    
    // Schedule the actual piece placement after animation
    setTimeout(() => {
      const newBoard = createEmptyBoard();
      
      // Copy current board state
      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
          newBoard[r][c] = board[r][c];
        }
      }
      
      // Clear temporary piece and place in final position
      newBoard[0][colIndex] = EMPTY;
      newBoard[rowIndex][colIndex] = currentPlayer;
      setBoard(newBoard);
      setDropAnimation({ active: false, col: null, row: null, player: null });
      
      // Check for win
      if (checkWin(newBoard, rowIndex, colIndex)) {
        setWinner(currentPlayer);
        setGameOver(true);
        setAnimating(false);
        return;
      }
      
      // Check for draw
      if (isBoardFull(newBoard)) {
        setGameOver(true);
        setAnimating(false);
        return;
      }
      
      // Switch player
      setCurrentPlayer(currentPlayer === PLAYER1 ? PLAYER2 : PLAYER1);
      setAnimating(false);
    }, 500); // Animation duration
  };

  // Check if board is full
  const isBoardFull = (board: (string | null)[][]) => {
    return board[0].every(cell => cell !== EMPTY);
  };

  // Reset game
  const resetGame = () => {
    setBoard(createEmptyBoard());
    setCurrentPlayer(PLAYER1);
    setWinner(null);
    setGameOver(false);
    setDropAnimation({ active: false, col: null, row: null, player: null });
  };

  // Go back to menu
  const goToMenu = () => {
    resetGame();
    setGameMode(null);
  };

  // Check for win
  const checkWin = (board: (string | null)[][], row: number, col: number) => {
    const directions = [
      [0, 1],  // horizontal
      [1, 0],  // vertical
      [1, 1],  // diagonal down-right
      [1, -1]  // diagonal down-left
    ];
    
    const player = board[row][col];
    
    for (const [dr, dc] of directions) {
      let count = 1;  // Start with 1 for the piece just placed
      
      // Check in positive direction
      for (let i = 1; i < 4; i++) {
        const r = row + dr * i;
        const c = col + dc * i;
        if (r >= 0 && r < ROWS && c >= 0 && c < COLS && board[r][c] === player) {
          count++;
        } else {
          break;
        }
      }
      
      // Check in negative direction
      for (let i = 1; i < 4; i++) {
        const r = row - dr * i;
        const c = col - dc * i;
        if (r >= 0 && r < ROWS && c >= 0 && c < COLS && board[r][c] === player) {
          count++;
        } else {
          break;
        }
      }
      
      if (count >= 4) {
        return true;
      }
    }
    
    return false;
  };

  // Calculate animation styles for dropping piece
  const getAnimationStyle = (rowIdx: number, colIdx: number): React.CSSProperties => {
    if (dropAnimation.active && colIdx === dropAnimation.col) {
      if (rowIdx === 0) {
        // This is our animated piece at the top
        const dropDistance = dropAnimation.row ? dropAnimation.row * 48 : 0; // 48px per cell
        return {
          backgroundColor: dropAnimation.player === PLAYER1 ? '#e53e3e' : '#ecc94b',
          transform: `translateY(${dropDistance}px)`,
          transition: 'transform 500ms cubic-bezier(0.70, 0.05, 0.95, 0.90)',
          zIndex: 10
        };
      } else if (rowIdx === dropAnimation.row) {
        // Hide the destination cell during animation
        return { opacity: 0 };
      }
    }
    
    // Normal cells
    return {
      backgroundColor: 
        board[rowIdx][colIdx] === PLAYER1 ? '#e53e3e' : 
        board[rowIdx][colIdx] === PLAYER2 ? '#ecc94b' : 
        'white',
      transition: 'background-color 300ms',
    };
  };

  // Simple AI implementation for 1-player mode
  useEffect(() => {
    if (gameMode === '1P' && currentPlayer === PLAYER2 && !gameOver && !animating) {
      // Add a small delay before AI move to make it feel more natural
      const timeout = setTimeout(() => {
        // Find all valid columns (not full)
        const validMoves = [];
        for (let c = 0; c < COLS; c++) {
          if (board[0][c] === EMPTY) {
            validMoves.push(c);
          }
        }
        
        if (validMoves.length > 0) {
          // Choose a random valid column
          const randomCol = validMoves[Math.floor(Math.random() * validMoves.length)];
          handleColumnClick(randomCol);
        }
      }, 1000);
      
      return () => clearTimeout(timeout);
    }
  }, [currentPlayer, gameMode, gameOver, animating]);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto">
        {gameMode ? (
          <Board 
            board={board}
            currentPlayer={currentPlayer}
            winner={winner}
            gameOver={gameOver}
            animating={animating}
            handleColumnClick={handleColumnClick}
            getAnimationStyle={getAnimationStyle}
            goToMenu={goToMenu}
          />
        ) : (
          <Menu setGameMode={setGameMode} />
        )}
      </div>
    </div>
  );
};

export default ConnectFour;