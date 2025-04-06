import { downloadPdf } from '../utils';
import * as styles from './PdfPreview.css.ts';
import { useEffect, useState } from 'react';
import { useFileStore } from '@/store';
import { useCanvasContext } from '@/context/useCanvasContext.ts';

const PdfPreview = () => {
  const { signedFile, previewFile, selectedPageFileIndex } = useFileStore();
  const file = previewFile();
  const { canvasRef, initializeCanvas, clearCanvas } = useCanvasContext();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!file) return;

    initializeCanvas(file, selectedPageFileIndex);
  }, [file, selectedPageFileIndex]);

  useEffect(() => {
    if (file) return;
    clearCanvas();
  }, [file]);

  const handleDownload = async () => {
    if (!file) return;

    setLoading(true);
    await downloadPdf(file);
    setLoading(false);
  };

  return (
    <div className={styles.container}>
      <div>
        <canvas ref={canvasRef} className={styles.canvas} />

        {file && (
          <button
            disabled={!signedFile || loading}
            type="button"
            onClick={handleDownload}
            className={styles.button}
          >
            {loading ? '다운로드 중....' : 'PDF 다운로드'}
          </button>
        )}
      </div>
    </div>
  );
};

export default PdfPreview;
