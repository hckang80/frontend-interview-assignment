import React, { memo, useRef } from 'react';
import * as styles from './PdfUploader.css';
import { Stamp } from '@/types';
import { useCanvasContext } from '@/context/useCanvasContext';

interface StampUploadProps {
  stamps: Stamp[];
  selectedStampIndex: number;
  setSelectedStampIndex: (index: number) => void;
  handleStampChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const StampUpload: React.FC<StampUploadProps> = ({
  stamps,
  selectedStampIndex,
  setSelectedStampIndex,
  handleStampChange
}) => {
  const { placeStampOnCanvas } = useCanvasContext();
  const stampInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleStampChange(e);
    if (!stamps.length && e.target.files) placeStampOnCanvas(e.target.files[0]);
  };

  const handleStampUpload = () => {
    stampInputRef.current?.click();
  };

  const handleClickStamp = (file: File, index: number) => {
    setSelectedStampIndex(index);
    placeStampOnCanvas(file);
  };

  return (
    <div>
      <div className={styles.stampUpload}>
        <input
          ref={stampInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleChange}
          style={{ display: 'none' }}
        />
        <button type="button" onClick={handleStampUpload} className={styles.button}>
          도장 업로드
        </button>
      </div>

      <div className={styles.stamps}>
        {stamps.map(({ id, url, file }, index) => (
          <button
            className={index === selectedStampIndex ? styles.stampButtonActive : styles.stampButton}
            key={id}
            onClick={() => handleClickStamp(file, index)}
          >
            <img src={url} alt="" className={styles.stampImage} />
          </button>
        ))}
      </div>
    </div>
  );
};

export default memo(StampUpload);
