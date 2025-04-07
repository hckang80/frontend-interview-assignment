import { downloadPdf } from '@/utils';
import * as styles from './PdfPreview.css.ts';
import { useEffect, useState } from 'react';
import { useFileStore } from '@/store';
import { useCanvasContext } from '@/context/useCanvasContext.ts';
import { Loading } from '@/components/shared';

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

        <Loading loading={loading} size={20} />

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
