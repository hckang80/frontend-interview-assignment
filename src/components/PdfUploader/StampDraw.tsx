import React from 'react';
import * as styles from './PdfUploader.css';

type StampType = {
  id: string;
  url: string;
};

interface StampDrawProps {
  originFile: File | null;
  stamps: StampType[];
  handleStampDraw: (file: File) => Promise<void>;
}

const StampDraw: React.FC<StampDrawProps> = ({ originFile, stamps, handleStampDraw }) => {
  return (
    <div>
      {originFile && (
        <button
          type="button"
          disabled={!stamps.length}
          onClick={() => handleStampDraw(originFile)}
          className={styles.button}
        >
          도장 찍기
        </button>
      )}
    </div>
  );
};

export default StampDraw;
