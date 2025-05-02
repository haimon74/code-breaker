import React, { useState, useMemo, useCallback } from 'react';
import GameHeader from './GameHeader';
import GameBoard from './GameBoard';
import ColorPalette from './ColorPalette';
import styles from './styles/MastermindGame.module.css';

// Color palettes
const COLOR_PALETTES = {
  rainbow: ['#6434e9', '#2c7ce5', '#49cc5c', '#f8c421', '#fb6640', '#f82553'],
  contrast: ['#0015ff', '#ff00a1', '#90fe00', '#8400ff', '#00fff7', '#ff7300'],
  pastel: ['#ec8a83', '#ffad85', '#f9f176', '#8be59d', '#6ab4f1', '#a983d8'],
};

const MAX_ATTEMPTS = 10;
const DEFAULT_CODE_LENGTH = 4;

function getRandomCode(colors: string[], codeLength: number): string[] {
  const available = [...colors];
  const code: string[] = [];
  for (let i = 0; i < codeLength; i++) {
    const idx = Math.floor(Math.random() * available.length);
    code.push(available[idx]);
    available.splice(idx, 1);
  }
  return code;
}

const CodeBreakerGame: React.FC = () => {
  const [paletteName, setPaletteName] = useState<'rainbow' | 'contrast' | 'pastel'>('rainbow');
  const [codeLength, setCodeLength] = useState<number>(DEFAULT_CODE_LENGTH);
  const [secretCode, setSecretCode] = useState<string[]>(() => getRandomCode(COLOR_PALETTES['rainbow'], DEFAULT_CODE_LENGTH));
  const [guesses, setGuesses] = useState<string[][]>([]);
  const [feedbacks, setFeedbacks] = useState<{ black: number; white: number }[]>([]);
  const [currentGuess, setCurrentGuess] = useState<string[]>(Array(DEFAULT_CODE_LENGTH).fill(''));
  const [gameStatus, setGameStatus] = useState<'playing' | 'won' | 'lost'>('playing');
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [timer, setTimer] = useState<number>(0);

  // Timer effect
  React.useEffect(() => {
    if (gameStatus !== 'playing') return;
    const interval = setInterval(() => setTimer(Date.now() - startTime), 1000);
    return () => clearInterval(interval);
  }, [gameStatus, startTime]);

  // Memoized color palette
  const colorOptions = useMemo(() => COLOR_PALETTES[paletteName], [paletteName]);

  // Start a new game
  const handleNewGame = useCallback(() => {
    setSecretCode(getRandomCode(COLOR_PALETTES[paletteName], codeLength));
    setGuesses([]);
    setFeedbacks([]);
    setCurrentGuess(Array(codeLength).fill(''));
    setGameStatus('playing');
    setStartTime(Date.now());
    setTimer(0);
  }, [paletteName, codeLength]);

  // Change palette
  const handlePaletteChange = useCallback((name: 'rainbow' | 'contrast' | 'pastel') => {
    setPaletteName(name);
    setSecretCode(getRandomCode(COLOR_PALETTES[name], codeLength));
    setGuesses([]);
    setFeedbacks([]);
    setCurrentGuess(Array(codeLength).fill(''));
    setGameStatus('playing');
    setStartTime(Date.now());
    setTimer(0);
  }, [codeLength]);

  // Change code length
  const handleCodeLengthChange = useCallback((len: number) => {
    setCodeLength(len);
    setSecretCode(getRandomCode(colorOptions, len));
    setGuesses([]);
    setFeedbacks([]);
    setCurrentGuess(Array(len).fill(''));
    setGameStatus('playing');
    setStartTime(Date.now());
    setTimer(0);
  }, [colorOptions]);

  // Handle color drop
  const handleColorDrop = useCallback((color: string, position: number) => {
    setCurrentGuess((prev) => {
      const next = [...prev];
      next[position] = color;
      return next;
    });
  }, []);

  // Feedback calculation
  const getFeedback = useCallback((guess: string[], code: string[]) => {
    let black = 0, white = 0;
    const codeCopy = [...code];
    const guessCopy = [...guess];
    // First pass: correct color and position
    for (let i = 0; i < code.length; i++) {
      if (guessCopy[i] === codeCopy[i]) {
        black++;
        codeCopy[i] = guessCopy[i] = '';
      }
    }
    // Second pass: correct color, wrong position
    for (let i = 0; i < code.length; i++) {
      if (guessCopy[i] && codeCopy.includes(guessCopy[i])) {
        white++;
        codeCopy[codeCopy.indexOf(guessCopy[i])] = '';
      }
    }
    return { black, white };
  }, []);

  // Submit guess
  const handleSubmitGuess = useCallback(() => {
    if (currentGuess.includes('')) return;
    const feedback = getFeedback(currentGuess, secretCode);
    const newGuesses = [...guesses, currentGuess];
    const newFeedbacks = [...feedbacks, feedback];
    setGuesses(newGuesses);
    setFeedbacks(newFeedbacks);
    setCurrentGuess(Array(codeLength).fill(''));
    if (feedback.black === codeLength) {
      setGameStatus('won');
    } else if (newGuesses.length >= MAX_ATTEMPTS) {
      setGameStatus('lost');
    }
  }, [currentGuess, secretCode, guesses, feedbacks, codeLength, getFeedback]);

  // Only allow colors not already in the guess
  const availableColors = useMemo(() => colorOptions.filter(c => !currentGuess.includes(c)), [colorOptions, currentGuess]);

  return (
    <div className={styles.mastermindGame}>
      <GameHeader
        codeLength={codeLength}
        paletteName={paletteName}
        onPaletteChange={handlePaletteChange}
        onCodeLengthChange={handleCodeLengthChange}
        onNewGame={handleNewGame}
        timer={timer}
        gameStatus={gameStatus}
      />
      <GameBoard
        guesses={guesses}
        feedbacks={feedbacks}
        currentGuess={currentGuess}
        codeLength={codeLength}
        maxAttempts={MAX_ATTEMPTS}
        onColorDrop={handleColorDrop}
        onSubmitGuess={handleSubmitGuess}
        gameStatus={gameStatus}
        secretCode={secretCode}
      />
      <ColorPalette
        colors={availableColors}
        onColorDrag={handleColorDrop}
        disabled={gameStatus !== 'playing'}
      />
    </div>
  );
};

export default CodeBreakerGame; 