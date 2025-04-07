import { downloadPdf } from '../../utils/index.ts';
import * as styles from './PdfPreview.css.ts';
import { CSSProperties, useEffect, useState } from 'react';
import { useFileStore } from '@/store';
import { useCanvasContext } from '@/context/useCanvasContext.ts';
import SyncLoader from 'react-spinners/SyncLoader';

const override: CSSProperties = {
  position: 'absolute',
  left: '50%',
  top: '50%',
  transform: 'translate(-50%, -50%)'
};

const PdfPreview = () => {
  const { signedFile, previewFile, selectedPageFileIndex } = useFileStore();
  const file = previewFile();
  const { canvasRef, initializeCanvas, clearCanvas } = useCanvasContext();
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    if (!file) return;

    (async () => {
      setLoading(true);
      await initializeCanvas(file, selectedPageFileIndex);
      setLoading(false);
    })();
  }, [file, selectedPageFileIndex]);

  useEffect(() => {
    if (file) return;

    clearCanvas();
  }, [file]);

  const handleDownload = async () => {
    if (!file) return;

    setDownloading(true);
    await downloadPdf(file);
    setDownloading(false);
  };

  return (
    <div className={styles.container}>
      <div>
        <canvas ref={canvasRef} className={styles.canvas} />

        <SyncLoader
          loading={loading}
          cssOverride={override}
          color="var(--primary)"
          size={20}
          aria-label="Loading Spinner"
          data-testid="loader"
        />

        {file && (
          <button
            disabled={!signedFile || downloading}
            type="button"
            onClick={handleDownload}
            className={styles.button}
          >
            {downloading ? '다운로드 중....' : 'PDF 다운로드'}
          </button>
        )}
      </div>
    </div>
  );
};

export default PdfPreview;
