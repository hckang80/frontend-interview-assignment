import React, { useRef, useCallback, memo } from 'react';
import * as styles from './PdfUploader.css';
import { useFileStore } from '@/store';

const PdfUpload = () => {
  const pdfInputRef = useRef<HTMLInputElement>(null);
  const { originFile, setOriginFile, resetFile } = useFileStore();

  const handlePDFRemove = () => {
    resetFile();
  };

  const handlePDFChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { files } = e.target;
      if (!files) return;

      const [file] = files;

      handlePDFRemove();
      setOriginFile(file);

      e.target.value = '';
    },
    [setOriginFile, handlePDFRemove]
  );

  const handlePDFUpload = () => {
    pdfInputRef.current?.click();
  };

  return (
    <div>
      <div className={styles.pdfUpload}>
        <input
          ref={pdfInputRef}
          type="file"
          accept=".pdf"
          onChange={handlePDFChange}
          style={{ display: 'none' }}
        />

        <button type="button" onClick={handlePDFUpload} className={styles.button}>
          PDF 업로드
        </button>
      </div>

      <div className={styles.pdfFile}>
        {!!originFile?.name && (
          <>
            📄 파일명: <strong>{originFile?.name}</strong>
            <button type="button" className={styles.pdfFileRemove} onClick={handlePDFRemove}>
              X
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default memo(PdfUpload);
