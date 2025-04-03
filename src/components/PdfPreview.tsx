import { useEffect, useState } from 'react';
import { useStore } from '@/store/index';

import { loadPdf, getImageByPdf, downloadPdf } from '../utils';
import * as styles from './PdfPreview.css.ts';

const PdfPreview = () => {
  const { printedFile, selectedPageIndex } = useStore();
  const file = printedFile();
  const [fileImage, setFileImage] = useState('');

  useEffect(() => {
    if (!file) return setFileImage('');

    (async () => {
      const { pdf } = await loadPdf(file);

      const loadedImage = await getImageByPdf(pdf, selectedPageIndex);
      setFileImage(loadedImage);
    })();
  }, [file, selectedPageIndex]);

  return (
    <div className={styles.container}>
      {file && fileImage ? (
        <>
          <img src={fileImage} alt="" className={styles.image} />
          <button type="button" onClick={() => downloadPdf(file)} className={styles.button}>
            PDF 다운로드
          </button>
        </>
      ) : (
        <p>PDF를 업로드 해보세요.</p>
      )}
    </div>
  );
};

export default PdfPreview;
