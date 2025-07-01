import { 
  Board, 
  Tetromino, 
  GameState, 
  Position, 
  TETROMINO_SHAPES, 
  TetrominoType, 
  BOARD_WIDTH, 
  BOARD_HEIGHT 
} from '@/types/tetris';

export const createEmptyBoard = (): Board => {
  return Array(BOARD_HEIGHT).fill(null).map(() => Array(BOARD_WIDTH).fill(null));
};

export const getRandomTetromino = (): Tetromino => {
  const tetrominoTypes = Object.keys(TETROMINO_SHAPES) as TetrominoType[];
  const randomType = tetrominoTypes[Math.floor(Math.random() * tetrominoTypes.length)];
  const tetrominoData = TETROMINO_SHAPES[randomType];
  
  return {
    shape: tetrominoData.shape,
    color: tetrominoData.color,
    position: { x: Math.floor(BOARD_WIDTH / 2) - Math.floor(tetrominoData.shape[0].length / 2), y: 0 }
  };
};

export const isValidPosition = (board: Board, tetromino: Tetromino, position: Position): boolean => {
  for (let y = 0; y < tetromino.shape.length; y++) {
    for (let x = 0; x < tetromino.shape[y].length; x++) {
      if (tetromino.shape[y][x]) {
        const newX = position.x + x;
        const newY = position.y + y;
        
        if (newX < 0 || newX >= BOARD_WIDTH || newY >= BOARD_HEIGHT) {
          return false;
        }
        
        if (newY >= 0 && board[newY][newX]) {
          return false;
        }
      }
    }
  }
  return true;
};

export const rotateTetromino = (tetromino: Tetromino): Tetromino => {
  const rotatedShape = tetromino.shape[0].map((_, colIndex) =>
    tetromino.shape.map(row => row[colIndex]).reverse()
  );
  
  return {
    ...tetromino,
    shape: rotatedShape
  };
};

export const placeTetromino = (board: Board, tetromino: Tetromino): Board => {
  const newBoard = board.map(row => [...row]);
  
  for (let y = 0; y < tetromino.shape.length; y++) {
    for (let x = 0; x < tetromino.shape[y].length; x++) {
      if (tetromino.shape[y][x]) {
        const boardY = tetromino.position.y + y;
        const boardX = tetromino.position.x + x;
        if (boardY >= 0) {
          newBoard[boardY][boardX] = tetromino.color;
        }
      }
    }
  }
  
  return newBoard;
};

export const clearLines = (board: Board): { newBoard: Board; linesCleared: number } => {
  const fullLines: number[] = [];
  
  for (let y = 0; y < BOARD_HEIGHT; y++) {
    if (board[y].every(cell => cell !== null)) {
      fullLines.push(y);
    }
  }
  
  if (fullLines.length === 0) {
    return { newBoard: board, linesCleared: 0 };
  }
  
  const newBoard = board.filter((_, y) => !fullLines.includes(y));
  
  while (newBoard.length < BOARD_HEIGHT) {
    newBoard.unshift(Array(BOARD_WIDTH).fill(null));
  }
  
  return { newBoard, linesCleared: fullLines.length };
};

export const calculateScore = (linesCleared: number, level: number): number => {
  const baseScores = [0, 40, 100, 300, 1200];
  return baseScores[linesCleared] * (level + 1);
};

export const calculateLevel = (lines: number): number => {
  return Math.floor(lines / 10);
};

export const getDropSpeed = (level: number): number => {
  return Math.max(50, 1000 - (level * 50));
};

export const isGameOver = (board: Board, tetromino: Tetromino): boolean => {
  return !isValidPosition(board, tetromino, tetromino.position);
};