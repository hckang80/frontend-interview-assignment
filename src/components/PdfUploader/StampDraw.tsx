import React, { memo } from 'react';
import * as styles from './PdfUploader.css';
import { Stamp } from '@/types';

interface StampDrawProps {
  stamps: Stamp[];
  handleStampDraw: () => Promise<void>;
}

const StampDraw: React.FC<StampDrawProps> = ({ stamps, handleStampDraw }) => {
  return (
    <div>
      <button
        type="button"
        disabled={!stamps.length}
        onClick={handleStampDraw}
        className={styles.button}
      >
        도장 찍기
      </button>
    </div>
  );
};

export default memo(StampDraw);
