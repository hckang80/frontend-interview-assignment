import React, { memo } from 'react';
import * as styles from './PdfUploader.css';
import type { Stamp } from '@/types';
import { useFileStore } from '@/store';

interface StampDrawProps {
  stamps: Stamp[];
  handleStampDraw: () => Promise<void>;
}

const StampDraw: React.FC<StampDrawProps> = ({ stamps, handleStampDraw }) => {
  const { originFile } = useFileStore();

  return (
    <div>
      <button
        type="button"
        disabled={!originFile || !stamps.length}
        onClick={handleStampDraw}
        className={styles.button}
      >
        도장 찍기
      </button>
    </div>
  );
};

export default memo(StampDraw);
