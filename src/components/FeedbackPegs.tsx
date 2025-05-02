import React from 'react';
import styles from './styles/FeedbackPegs.module.css';

type FeedbackPegsProps = {
  feedback?: { black: number; white: number };
  codeLength: number;
};

const FeedbackPegs: React.FC<FeedbackPegsProps> = React.memo(({ feedback, codeLength }) => {
  const pegs = React.useMemo(() => {
    if (!feedback) return Array(codeLength).fill(null);
    return [
      ...Array(feedback.black).fill('black'),
      ...Array(feedback.white).fill('white'),
      ...Array(codeLength - feedback.black - feedback.white).fill(null),
    ];
  }, [feedback, codeLength]);
  return (
    <div className={styles.feedback}>
      {pegs.map((peg, i) => (
        <span
          key={i}
          className={
            peg === 'black'
              ? styles.black
              : peg === 'white'
              ? styles.white
              : styles.empty
          }
        />
      ))}
    </div>
  );
});

export default FeedbackPegs; 