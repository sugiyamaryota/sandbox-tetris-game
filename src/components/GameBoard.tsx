'use client';

import React from 'react';
import { Board, Tetromino } from '@/types/tetris';

interface GameBoardProps {
  board: Board;
  currentPiece: Tetromino | null;
}

const GameBoard: React.FC<GameBoardProps> = ({ board, currentPiece }) => {
  const getCellColor = (rowIndex: number, colIndex: number): string => {
    if (board[rowIndex][colIndex]) {
      return board[rowIndex][colIndex] as string;
    }
    
    if (currentPiece) {
      const relativeY = rowIndex - currentPiece.position.y;
      const relativeX = colIndex - currentPiece.position.x;
      
      if (
        relativeY >= 0 &&
        relativeY < currentPiece.shape.length &&
        relativeX >= 0 &&
        relativeX < currentPiece.shape[relativeY].length &&
        currentPiece.shape[relativeY][relativeX]
      ) {
        return currentPiece.color;
      }
    }
    
    return 'transparent';
  };

  return (
    <div className="game-board">
      {board.map((row, rowIndex) => (
        <div key={rowIndex} className="board-row">
          {row.map((_, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className="board-cell"
              style={{
                backgroundColor: getCellColor(rowIndex, colIndex),
                border: getCellColor(rowIndex, colIndex) === 'transparent' 
                  ? '1px solid #333' 
                  : '1px solid #000'
              }}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default GameBoard;