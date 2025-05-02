import React from 'react';
import GuessRow from './GuessRow';
import styles from './styles/GameBoard.module.css';

type GameBoardProps = {
  guesses: string[][];
  feedbacks: { black: number; white: number }[];
  currentGuess: string[];
  codeLength: number;
  maxAttempts: number;
  onColorDrop: (color: string, position: number) => void;
  onSubmitGuess: () => void;
  gameStatus: 'playing' | 'won' | 'lost';
  secretCode: string[];
};

const GameBoard: React.FC<GameBoardProps> = React.memo(({
  guesses,
  feedbacks,
  currentGuess,
  codeLength,
  maxAttempts,
  onColorDrop,
  onSubmitGuess,
  gameStatus,
  secretCode,
}) => {
  // Show secret code only if game is over
  const showSecret = gameStatus !== 'playing';
  return (
    <div className={styles.board}>
      <div className={styles.secretRow}  style={{ marginLeft: - codeLength*12 }}>
        {secretCode.map((color, i) => (
          <span
            key={i}
            className={styles.secretPeg}
            style={{ background: showSecret ? color : '#222', color: showSecret ? 'transparent' : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', fontWeight: 600 }}
          >
            {!showSecret && '❓'}
          </span>
        ))}
      </div>
      {[...Array(maxAttempts)].map((_, idx) => {
        const guess = guesses[idx];
        const feedback = feedbacks[idx];
        const isCurrent = idx === guesses.length && gameStatus === 'playing';
        return (
          <GuessRow
            key={idx}
            guess={isCurrent ? currentGuess : guess || []}
            feedback={feedback}
            codeLength={codeLength}
            isActive={isCurrent}
            onColorDrop={onColorDrop}
            onSubmitGuess={onSubmitGuess}
            disabled={!isCurrent || gameStatus !== 'playing'}
          />
        );
      })}
    </div>
  );
});

export default GameBoard; 