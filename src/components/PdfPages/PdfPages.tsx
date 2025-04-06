import { CSSProperties, useEffect, useState } from 'react';
import { useFileStore } from '@/store';

import * as styles from './PdfPages.css.ts';
import { getImageByPdf, loadPdf } from '../../utils/index.ts';
import SyncLoader from 'react-spinners/SyncLoader';

type FileImage = {
  id: string;
  url: string;
};

const override: CSSProperties = {
  position: 'absolute',
  left: '50%',
  top: '50%',
  transform: 'translate(-50%, -50%)'
};

const PdfPages = () => {
  const { previewFile, selectedPageFileIndex, setSelectedPageFileIndex } = useFileStore();
  const file = previewFile();
  const [fileImages, setFileImages] = useState<FileImage[]>([]);
  const [loading, setLoading] = useState(false);

  const isActive = (index: number) => selectedPageFileIndex === index;

  useEffect(() => {
    if (!file) return setFileImages([]);

    (async () => {
      setLoading(true);
      const { totalPages, pdf } = await loadPdf(file);

      const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);
      const loadedImages = await Promise.all(
        pageNumbers.map(async (pageNumber) => ({
          id: crypto.randomUUID(),
          url: await getImageByPdf(pdf, pageNumber)
        }))
      );

      setLoading(false);
      setFileImages(loadedImages);
    })();
  }, [file]);

  return (
    <div className={styles.container}>
      <div className={styles.top}>
        {file &&
          fileImages.map(({ id, url }, index) => (
            <div key={id} onClick={() => setSelectedPageFileIndex(index + 1)}>
              <button
                disabled={loading}
                className={isActive(index + 1) ? styles.buttonActive : styles.button}
              >
                <img src={url} alt="" className={styles.imageContent} />
                <SyncLoader
                  loading={loading && isActive(index + 1)}
                  cssOverride={override}
                  color="var(--primary)"
                  size={10}
                  aria-label="Loading Spinner"
                  data-testid="loader"
                />
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
