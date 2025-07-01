const HIGH_SCORE_KEY = 'tetris_high_score';

export const getHighScore = (): number => {
  if (typeof window === 'undefined') {
    return 0;
  }
  
  try {
    const storedScore = localStorage.getItem(HIGH_SCORE_KEY);
    if (!storedScore) {
      return 0;
    }
    
    const parsedScore = parseInt(storedScore, 10);
    return isNaN(parsedScore) ? 0 : parsedScore;
  } catch (error) {
    console.error('Error reading high score from localStorage:', error);
    return 0;
  }
};

export const setHighScore = (score: number): void => {
  if (typeof window === 'undefined') {
    return;
  }
  
  try {
    localStorage.setItem(HIGH_SCORE_KEY, score.toString());
  } catch (error) {
    console.error('Error saving high score to localStorage:', error);
  }
};

export const updateHighScore = (currentScore: number): boolean => {
  const highScore = getHighScore();
  if (currentScore > highScore) {
    setHighScore(currentScore);
    return true;
  }
  return false;
};