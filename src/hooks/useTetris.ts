'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  GameState,
  Position,
  BOARD_WIDTH,
  BOARD_HEIGHT
} from '@/types/tetris';
import {
  createEmptyBoard,
  getRandomTetromino,
  isValidPosition,
  rotateTetromino,
  placeTetromino,
  clearLines,
  calculateScore,
  calculateLevel,
  getDropSpeed,
  isGameOver
} from '@/utils/tetris';

export const useTetris = () => {
  const [gameState, setGameState] = useState<GameState>(() => ({
    board: createEmptyBoard(),
    currentPiece: getRandomTetromino(),
    nextPiece: getRandomTetromino(),
    score: 0,
    level: 0,
    lines: 0,
    gameOver: false,
    isPaused: false
  }));

  const [dropTime, setDropTime] = useState<number | null>(null);

  const movePiece = useCallback((deltaX: number, deltaY: number) => {
    setGameState(prevState => {
      if (!prevState.currentPiece || prevState.gameOver || prevState.isPaused) {
        return prevState;
      }

      const newPosition: Position = {
        x: prevState.currentPiece.position.x + deltaX,
        y: prevState.currentPiece.position.y + deltaY
      };

      if (isValidPosition(prevState.board, prevState.currentPiece, newPosition)) {
        return {
          ...prevState,
          currentPiece: {
            ...prevState.currentPiece,
            position: newPosition
          }
        };
      }

      return prevState;
    });
  }, []);

  const rotatePiece = useCallback(() => {
    setGameState(prevState => {
      if (!prevState.currentPiece || prevState.gameOver || prevState.isPaused) {
        return prevState;
      }

      const rotatedPiece = rotateTetromino(prevState.currentPiece);

      if (isValidPosition(prevState.board, rotatedPiece, rotatedPiece.position)) {
        return {
          ...prevState,
          currentPiece: rotatedPiece
        };
      }

      return prevState;
    });
  }, []);

  const dropPiece = useCallback(() => {
    setGameState(prevState => {
      if (!prevState.currentPiece || prevState.gameOver || prevState.isPaused) {
        return prevState;
      }

      const newPosition: Position = {
        x: prevState.currentPiece.position.x,
        y: prevState.currentPiece.position.y + 1
      };

      if (isValidPosition(prevState.board, prevState.currentPiece, newPosition)) {
        return {
          ...prevState,
          currentPiece: {
            ...prevState.currentPiece,
            position: newPosition
          }
        };
      } else {
        const boardWithPiece = placeTetromino(prevState.board, prevState.currentPiece);
        const { newBoard, linesCleared } = clearLines(boardWithPiece);
        
        const newLines = prevState.lines + linesCleared;
        const newLevel = calculateLevel(newLines);
        const newScore = prevState.score + calculateScore(linesCleared, prevState.level);
        
        const nextPiece = prevState.nextPiece || getRandomTetromino();
        const newNextPiece = getRandomTetromino();

        if (isGameOver(newBoard, nextPiece)) {
          return {
            ...prevState,
            board: newBoard,
            score: newScore,
            level: newLevel,
            lines: newLines,
            gameOver: true
          };
        }

        return {
          ...prevState,
          board: newBoard,
          currentPiece: nextPiece,
          nextPiece: newNextPiece,
          score: newScore,
          level: newLevel,
          lines: newLines
        };
      }
    });
  }, []);

  const hardDrop = useCallback(() => {
    setGameState(prevState => {
      if (!prevState.currentPiece || prevState.gameOver || prevState.isPaused) {
        return prevState;
      }

      let newY = prevState.currentPiece.position.y;
      const testPiece = { ...prevState.currentPiece };

      while (isValidPosition(prevState.board, testPiece, { x: testPiece.position.x, y: newY + 1 })) {
        newY++;
      }

      testPiece.position.y = newY;
      
      const boardWithPiece = placeTetromino(prevState.board, testPiece);
      const { newBoard, linesCleared } = clearLines(boardWithPiece);
      
      const newLines = prevState.lines + linesCleared;
      const newLevel = calculateLevel(newLines);
      const newScore = prevState.score + calculateScore(linesCleared, prevState.level);
      
      const nextPiece = prevState.nextPiece || getRandomTetromino();
      const newNextPiece = getRandomTetromino();

      if (isGameOver(newBoard, nextPiece)) {
        return {
          ...prevState,
          board: newBoard,
          score: newScore,
          level: newLevel,
          lines: newLines,
          gameOver: true
        };
      }

      return {
        ...prevState,
        board: newBoard,
        currentPiece: nextPiece,
        nextPiece: newNextPiece,
        score: newScore,
        level: newLevel,
        lines: newLines
      };
    });
  }, []);

  const pauseGame = useCallback(() => {
    setGameState(prevState => ({
      ...prevState,
      isPaused: !prevState.isPaused
    }));
  }, []);

  const resetGame = useCallback(() => {
    setGameState({
      board: createEmptyBoard(),
      currentPiece: getRandomTetromino(),
      nextPiece: getRandomTetromino(),
      score: 0,
      level: 0,
      lines: 0,
      gameOver: false,
      isPaused: false
    });
  }, []);

  useEffect(() => {
    if (!gameState.gameOver && !gameState.isPaused) {
      setDropTime(getDropSpeed(gameState.level));
    } else {
      setDropTime(null);
    }
  }, [gameState.level, gameState.gameOver, gameState.isPaused]);

  useEffect(() => {
    if (dropTime !== null) {
      const interval = setInterval(() => {
        dropPiece();
      }, dropTime);

      return () => clearInterval(interval);
    }
  }, [dropTime, dropPiece]);

  return {
    gameState,
    movePiece,
    rotatePiece,
    dropPiece,
    hardDrop,
    pauseGame,
    resetGame
  };
};