import { useEffect, useState } from 'react';
import { useStore } from '@/store/index';

import * as styles from './PdfPageSelector.css.ts';
import { getImageByPdf, loadPdf } from '../utils';

const C = () => {
  const { printedFile, setSelectedPageIndex } = useStore();
  const file = printedFile();
  const [fileImages, setFileImages] = useState<string[]>([]);

  useEffect(() => {
    if (!file) return;

    (async () => {
      const { totalPages, pdf } = await loadPdf(file);

      const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);
      const loadedImages = await Promise.all(
        pageNumbers.map((pageNumber) => getImageByPdf(pdf, pageNumber))
      );

      setFileImages(loadedImages);
    })();
  }, [file]);

  return (
    <div className={styles.container}>
      <div className={styles.top}>
        {file &&
          fileImages.map((image, index) => (
            <div key={index} onClick={() => setSelectedPageIndex(index + 1)}>
              <div className={styles.image}>
                <img src={image} alt="" className={styles.imageContent} />
              </div>
              <div className={styles.imageIndex}>{index + 1}</div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default C;
