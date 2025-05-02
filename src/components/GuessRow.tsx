import React from 'react';
import FeedbackPegs from './FeedbackPegs';
import styles from './styles/GuessRow.module.css';

type GuessRowProps = {
  guess: string[];
  feedback?: { black: number; white: number };
  codeLength: number;
  isActive: boolean;
  onColorDrop: (color: string, position: number) => void;
  onSubmitGuess: () => void;
  disabled: boolean;
};

const GuessRow: React.FC<GuessRowProps> = React.memo(({
  guess,
  feedback,
  codeLength,
  isActive,
  onColorDrop,
  onSubmitGuess,
  disabled,
}) => {
  // Drag and drop handlers
  const handleDrop = (e: React.DragEvent, idx: number) => {
    if (disabled) return;
    const color = e.dataTransfer.getData('color');
    if (color) onColorDrop(color, idx);
  };
  const handleDragOver = (e: React.DragEvent) => {
    if (!disabled) e.preventDefault();
  };
  return (
    <div className={styles.row}>
      {isActive && (
        <button
          className={styles.submitBtn}
          onClick={onSubmitGuess}
          disabled={guess.includes('') || disabled}
        >
          OK
        </button>
      )}
      <div className={styles.pegs}>
        {Array.from({ length: codeLength }).map((_, idx) => (
          <span
            key={idx}
            className={styles.pegSlot}
            style={{ background: guess[idx] || '#222' }}
            onDrop={e => handleDrop(e, idx)}
            onDragOver={handleDragOver}
          />
        ))}
      </div>
      <FeedbackPegs feedback={feedback} codeLength={codeLength} />
    </div>
  );
});

export default GuessRow; 