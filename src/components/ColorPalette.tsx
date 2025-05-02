import React from 'react';
import styles from '../styles/ColorPalette.module.css';

type ColorPaletteProps = {
  colors: string[];
  onColorDrag: (color: string, position: number) => void;
  disabled: boolean;
};

const ColorPalette: React.FC<ColorPaletteProps> = React.memo(({ colors, onColorDrag, disabled }) => {
  // Drag start handler
  const handleDragStart = (color: string) => (e: React.DragEvent) => {
    e.dataTransfer.setData('color', color);
  };
  return (
    <div className={styles.palette}>
      {colors.map((color, idx) => (
        <span
          key={color}
          className={styles.color}
          style={{ background: color, opacity: disabled ? 0.5 : 1 }}
          draggable={!disabled}
          onDragStart={handleDragStart(color)}
        />
      ))}
    </div>
  );
});

export default ColorPalette; 