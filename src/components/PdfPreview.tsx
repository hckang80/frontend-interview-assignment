import { useEffect, useState } from 'react';
import { useStore } from '@/store/index';

import { loadPdf, getImageByPdf, downloadPdf } from '../utils';
import * as styles from './PdfPreview.css.ts';

const PdfPreview = () => {
  const { previewFile, signedFile, selectedPageIndex } = useStore();
  const file = previewFile();
  const [fileImage, setFileImage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!file) return setFileImage('');

    (async () => {
      const { pdf } = await loadPdf(file);

      const loadedImage = await getImageByPdf(pdf, selectedPageIndex);
      setFileImage(loadedImage);
    })();
  }, [file, selectedPageIndex]);

  const handleDownload = async () => {
    if (!file) return;

    setLoading(true);
    await downloadPdf(file);
    setLoading(false);
  };

  return (
    <div className={styles.container}>
      {file && fileImage ? (
        <>
          <img src={fileImage} alt="" className={styles.image} />
          <button
            disabled={!signedFile || loading}
            type="button"
            onClick={handleDownload}
            className={styles.button}
          >
            {loading ? '다운로드 중....' : 'PDF 다운로드'}
          </button>
        </>
      ) : (
        <p>PDF를 업로드 해보세요.</p>
      )}
    </div>
  );
};

export default PdfPreview;
