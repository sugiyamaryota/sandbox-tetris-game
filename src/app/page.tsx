'use client';

import React from 'react';
import GameBoard from '@/components/GameBoard';
import GameInfo from '@/components/GameInfo';
import { useTetris } from '@/hooks/useTetris';
import { useKeyboard } from '@/hooks/useKeyboard';

export default function Home() {
  const {
    gameState,
    movePiece,
    rotatePiece,
    hardDrop,
    pauseGame,
    resetGame
  } = useTetris();

  useKeyboard({
    onMoveLeft: () => movePiece(-1, 0),
    onMoveRight: () => movePiece(1, 0),
    onMoveDown: () => movePiece(0, 1),
    onRotate: rotatePiece,
    onHardDrop: hardDrop,
    onPause: pauseGame,
    onReset: resetGame
  });

  return (
    <div className="tetris-container">
      <div className="game-wrapper">
        <div className="game-content">
          <GameBoard 
            board={gameState.board} 
            currentPiece={gameState.currentPiece} 
          />
          <GameInfo 
            score={gameState.score}
            level={gameState.level}
            lines={gameState.lines}
            highScore={gameState.highScore}
            nextPiece={gameState.nextPiece}
          />
        </div>
        
        <div className="game-controls">
          <h2>テトリス</h2>
          {gameState.gameOver && (
            <div className="game-over">
              <h3>ゲームオーバー</h3>
              <button onClick={resetGame} className="reset-button">
                もう一度プレイ (R)
              </button>
            </div>
          )}
          {gameState.isPaused && !gameState.gameOver && (
            <div className="paused">
              <h3>一時停止中</h3>
            </div>
          )}
          <div className="instructions">
            <h4>操作方法:</h4>
            <ul>
              <li>←→: 左右移動</li>
              <li>↓: 下移動</li>
              <li>↑: 回転</li>
              <li>スペース: ハードドロップ</li>
              <li>P: 一時停止</li>
              <li>R: リセット</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
