import React, { useRef, useCallback } from 'react';
import * as styles from './PdfUploader.css';

interface PdfUploadProps {
  originFile: File | null;
  setOriginFile: (file: File) => void;
  handlePDFRemove: () => void;
}

const PdfUpload: React.FC<PdfUploadProps> = ({ originFile, setOriginFile, handlePDFRemove }) => {
  const pdfInputRef = useRef<HTMLInputElement>(null);

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

export default PdfUpload;
