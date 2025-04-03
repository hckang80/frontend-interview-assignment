import { useEffect, useState } from 'react';
import { useStore } from '@/store/index';

import * as styles from './PdfPages.css.ts';
import { getImageByPdf, loadPdf } from '../utils/index.ts';

type FileImage = {
  id: string;
  url: string;
};

const PdfPages = () => {
  const { printedFile, selectedPageIndex, setSelectedPageIndex } = useStore();
  const file = printedFile();
  const [fileImages, setFileImages] = useState<FileImage[]>([]);

  const isActive = (index: number) => selectedPageIndex === index;

  useEffect(() => {
    if (!file) return setFileImages([]);

    (async () => {
      const { totalPages, pdf } = await loadPdf(file);

      const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);
      const loadedImages = await Promise.all(
        pageNumbers.map(async (pageNumber) => ({
          id: crypto.randomUUID(),
          url: await getImageByPdf(pdf, pageNumber)
        }))
      );

      setFileImages(loadedImages);
    })();
  }, [file]);

  return (
    <div className={styles.container}>
      <div className={styles.top}>
        {file &&
          fileImages.map(({ id, url }, index) => (
            <div key={id} onClick={() => setSelectedPageIndex(index + 1)}>
              <button className={isActive(index + 1) ? styles.buttonActive : styles.button}>
                <img src={url} alt="" className={styles.imageContent} />
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
