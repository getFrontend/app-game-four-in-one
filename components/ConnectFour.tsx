"use client";

import React, { useState, useEffect } from 'react';
import Board from './Board';
import Menu from './Menu';

const ConnectFour: React.FC = () => {
  const ROWS = 6;
  const COLS = 7;
  const EMPTY = null;
  const PLAYER1 = 'yellow';
  const PLAYER2 = 'red';

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
          backgroundColor: dropAnimation.player === PLAYER1 ? '#fca000' : '#1f84c4',
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
        board[rowIdx][colIdx] === PLAYER1 ? '#fca000' : 
        board[rowIdx][colIdx] === PLAYER2 ? '#1f84c4' : 
        'white',
      transition: 'background-color 300ms',
    };
  };
  // Add evaluation function for board positions
  const evaluateBoard = (board: (string | null)[][], player: string) => {
    let score = 0;
    
    // Check horizontal, vertical, and diagonal lines
    const directions = [[0, 1], [1, 0], [1, 1], [1, -1]];
    
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        for (const [dr, dc] of directions) {
          let count = 0;
          let empty = 0;
          let opponent = 0;
          
          // Check four consecutive positions
          for (let i = 0; i < 4; i++) {
            const newR = r + dr * i;
            const newC = c + dc * i;
            
            if (newR >= 0 && newR < ROWS && newC >= 0 && newC < COLS) {
              if (board[newR][newC] === player) count++;
              else if (board[newR][newC] === null) empty++;
              else if (board[newR][newC] !== null) opponent++;
            }
          }
          
          // Score based on piece configurations
          if (count === 4) score += 100000; // Winning position
          else if (count === 3 && empty === 1) score += 1000; // Three in a row
          else if (count === 2 && empty === 2) score += 100; // Two in a row
          else if (opponent === 3 && empty === 1) score -= 900; // Block opponent's three
        }
      }
    }
    
    // Prefer center columns
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        if (board[r][c] === player) {
          score += Math.abs(COLS/2 - c) * -2; // Center control bonus
        }
      }
    }
    
    return score;
  };
  // Minimax algorithm with alpha-beta pruning
  const minimax = (board: (string | null)[][], depth: number, alpha: number, beta: number, maximizing: boolean): number => {
    if (depth === 0) return evaluateBoard(board, PLAYER2);
    
    if (maximizing) {
      let maxScore = -Infinity;
      for (let c = 0; c < COLS; c++) {
        if (board[0][c] === null) {
          let r = ROWS - 1;
          while (r >= 0 && board[r][c] !== null) r--;
          if (r >= 0) {
            board[r][c] = PLAYER2;
            if (checkWin(board, r, c)) {
              board[r][c] = null;
              return 100000;
            }
            const score = minimax(board, depth - 1, alpha, beta, false);
            board[r][c] = null;
            maxScore = Math.max(maxScore, score);
            alpha = Math.max(alpha, score);
            if (beta <= alpha) break;
          }
        }
      }
      return maxScore;
    } else {
      let minScore = Infinity;
      for (let c = 0; c < COLS; c++) {
        if (board[0][c] === null) {
          let r = ROWS - 1;
          while (r >= 0 && board[r][c] !== null) r--;
          if (r >= 0) {
            board[r][c] = PLAYER1;
            if (checkWin(board, r, c)) {
              board[r][c] = null;
              return -100000;
            }
            const score = minimax(board, depth - 1, alpha, beta, true);
            board[r][c] = null;
            minScore = Math.min(minScore, score);
            beta = Math.min(beta, score);
            if (beta <= alpha) break;
          }
        }
      }
      return minScore;
    }
  };
  // Update the AI move logic in useEffect
  useEffect(() => {
    if (gameMode === '1P' && currentPlayer === PLAYER2 && !gameOver && !animating) {
      const timeout = setTimeout(() => {
        let bestScore = -Infinity;
        let bestMove = 0;
        
        for (let c = 0; c < COLS; c++) {
          if (board[0][c] === null) {
            let r = ROWS - 1;
            while (r >= 0 && board[r][c] !== null) r--;
            if (r >= 0) {
              board[r][c] = PLAYER2;
              const score = minimax(board, 5, -Infinity, Infinity, false);
              board[r][c] = null;
              if (score > bestScore) {
                bestScore = score;
                bestMove = c;
              }
            }
          }
        }
        
        handleColumnClick(bestMove);
      }, 500);
      
      return () => clearTimeout(timeout);
    }
  }, [currentPlayer, gameMode, gameOver, animating]);
  // Update the setGameMode handling in Menu click
  const handleGameModeSelect = (mode: string) => {
    setGameMode(mode);
    setCurrentPlayer(PLAYER1); // Always ensure human player (PLAYER1) goes first
    setBoard(createEmptyBoard());
  };
  return (
    <div className="min-h-screen bg-[#f7f7f7] p-4 sm:p-6">
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
            gameMode={gameMode}
          />
        ) : (
          <Menu setGameMode={handleGameModeSelect} />
        )}
      </div>
    </div>
  );
};

export default ConnectFour;