import React from 'react';
import styles from '../styles/GameHeader.module.css';

type GameHeaderProps = {
  codeLength: number;
  paletteName: 'rainbow' | 'contrast' | 'pastel';
  onPaletteChange: (name: 'rainbow' | 'contrast' | 'pastel') => void;
  onCodeLengthChange: (len: number) => void;
  onNewGame: () => void;
  timer: number;
  gameStatus: 'playing' | 'won' | 'lost';
};

const formatTime = (ms: number) => {
  const sec = Math.floor(ms / 1000) % 60;
  const min = Math.floor(ms / 60000);
  return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
};

const GameHeader: React.FC<GameHeaderProps> = React.memo(({
  codeLength,
  paletteName,
  onPaletteChange,
  onCodeLengthChange,
  onNewGame,
  timer,
  gameStatus,
}) => (
  <div className={styles.header}>
    <div className={styles.title}>Guess the Code</div>
    <div className={styles.controls}>
      <label>
        Code Length:
        <select value={codeLength} onChange={e => onCodeLengthChange(Number(e.target.value))}>
          {[3,4,5,6].map(len => <option key={len} value={len}>{len}</option>)}
        </select>
      </label>
      <label>
        Palette:
        <select value={paletteName} onChange={e => onPaletteChange(e.target.value as any)}>
          <option value="rainbow">Rainbow</option>
          <option value="contrast">Contrast</option>
          <option value="pastel">Pastel</option>
        </select>
      </label>
      <button onClick={onNewGame}>New Game</button>
      <span className={styles.timer}>⏱ {formatTime(timer)}</span>
    </div>
    {gameStatus === 'won' && <div className={styles.statusWin}>🎉 You cracked the code!</div>}
    {gameStatus === 'lost' && <div className={styles.statusLose}>💥 Out of tries! Try again.</div>}
  </div>
));

export default GameHeader; 