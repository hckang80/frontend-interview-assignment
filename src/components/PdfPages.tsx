import { useEffect, useState } from 'react';
import { useStore } from '@/store/index';

import * as styles from './PdfPages.css.ts';
import { getImageByPdf, loadPdf } from '../utils/index.ts';

const PdfPages = () => {
  const { printedFile, selectedPageIndex, setSelectedPageIndex } = useStore();
  const file = printedFile();
  const [fileImages, setFileImages] = useState<string[]>([]);

  const isActive = (index: number) => selectedPageIndex === index;

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
              <button className={isActive(index + 1) ? styles.buttonActive : styles.button}>
                <img src={image} alt="" className={styles.imageContent} />
              </button>
              <div className={isActive(index + 1) ? styles.imageIndexActive : styles.imageIndex}>
                {index + 1}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default PdfPages;
