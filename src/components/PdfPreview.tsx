import { downloadPdf } from '../utils';
import * as styles from './PdfPreview.css.ts';
import { useEffect } from 'react';
import { useFileStore } from '@/store';
import { useCanvasContext } from '@/context/useCanvasContext.ts';

const PdfPreview = () => {
  const { signedFile, previewFile, selectedPageIndex } = useFileStore();
  const file = previewFile();
  const { canvasRef, initializeCanvas, clearCanvas } = useCanvasContext();

  useEffect(() => {
    if (!file) return;

    initializeCanvas(file, selectedPageIndex);
  }, [file, selectedPageIndex]);

  useEffect(() => {
    if (file) return;
    clearCanvas();
  }, [file]);

  return (
    <div className={styles.container}>
      <div>
        <canvas ref={canvasRef} className={styles.canvas} />

        {file && (
          <button
            disabled={!signedFile}
            type="button"
            onClick={() => downloadPdf(file)}
            className={styles.button}
          >
            PDF 다운로드
          </button>
        )}
      </div>
    </div>
  );
};

export default PdfPreview;
