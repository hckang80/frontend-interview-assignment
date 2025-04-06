import { downloadPdf } from '../utils';
import * as styles from './PdfPreview.css.ts';
import { useEffect } from 'react';
import { useStore } from '@/store';
import { useCanvasContext } from '@/context/useCanvasContext.ts';

const PdfPreview = () => {
  const { signedFile, previewFile, selectedPageIndex } = useStore();
  const file = previewFile();
  const { fabricCanvasRef, canvasRef, initializeCanvas } = useCanvasContext();

  useEffect(() => {
    if (!file) return;

    initializeCanvas(file, selectedPageIndex);

    return () => {
      if (fabricCanvasRef.current) {
        fabricCanvasRef.current.dispose();
        fabricCanvasRef.current = null;
      }
    };
  }, [file, selectedPageIndex, initializeCanvas]);

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
