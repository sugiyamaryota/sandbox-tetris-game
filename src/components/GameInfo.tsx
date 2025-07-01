'use client';

import React from 'react';
import { Tetromino } from '@/types/tetris';

interface GameInfoProps {
  score: number;
  level: number;
  lines: number;
  nextPiece: Tetromino | null;
}

const GameInfo: React.FC<GameInfoProps> = ({ score, level, lines, nextPiece }) => {
  return (
    <div className="game-info">
      <div className="score-section">
        <h3>スコア</h3>
        <p>{score.toLocaleString()}</p>
      </div>
      
      <div className="level-section">
        <h3>レベル</h3>
        <p>{level}</p>
      </div>
      
      <div className="lines-section">
        <h3>ライン数</h3>
        <p>{lines}</p>
      </div>
      
      <div className="next-piece-section">
        <h3>次のピース</h3>
        <div className="next-piece-preview">
          {nextPiece && (
            <div className="next-piece-grid">
              {nextPiece.shape.map((row, rowIndex) => (
                <div key={rowIndex} className="next-piece-row">
                  {row.map((cell, colIndex) => (
                    <div
                      key={`${rowIndex}-${colIndex}`}
                      className="next-piece-cell"
                      style={{
                        backgroundColor: cell ? nextPiece.color : 'transparent',
                        border: cell ? '1px solid #000' : '1px solid #333'
                      }}
                    />
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GameInfo;