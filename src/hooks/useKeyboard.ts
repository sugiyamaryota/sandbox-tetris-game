'use client';

import { useEffect } from 'react';

interface KeyboardControls {
  onMoveLeft: () => void;
  onMoveRight: () => void;
  onMoveDown: () => void;
  onRotate: () => void;
  onHardDrop: () => void;
  onPause: () => void;
  onReset: () => void;
}

export const useKeyboard = (controls: KeyboardControls) => {
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'ArrowLeft':
          event.preventDefault();
          controls.onMoveLeft();
          break;
        case 'ArrowRight':
          event.preventDefault();
          controls.onMoveRight();
          break;
        case 'ArrowDown':
          event.preventDefault();
          controls.onMoveDown();
          break;
        case 'ArrowUp':
          event.preventDefault();
          controls.onRotate();
          break;
        case ' ':
          event.preventDefault();
          controls.onHardDrop();
          break;
        case 'p':
        case 'P':
          event.preventDefault();
          controls.onPause();
          break;
        case 'r':
        case 'R':
          event.preventDefault();
          controls.onReset();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [controls]);
};