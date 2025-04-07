import { useEffect, useState } from 'react';
import { useFileStore } from '@/store';

import * as styles from './PdfPages.css.ts';
import { getImageByPdf, loadPdf } from '@/utils';
import { Loading } from '@/components/shared';
import type { FileImage } from '@/types';

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

      const pageIndices = Array.from({ length: totalPages }, (_, i) => i);
      const loadedImages = await Promise.all(
        pageIndices.map(async (pageIndex) => ({
          id: crypto.randomUUID(),
          url: await getImageByPdf(pdf, pageIndex)
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
            <div key={id}>
              <button
                disabled={loading}
                className={isActive(index) ? styles.buttonActive : styles.button}
                onClick={() => setSelectedPageFileIndex(index)}
              >
                <img src={url} alt="" className={styles.imageContent} />
                <Loading loading={loading && isActive(index)} />
              </button>
              <div className={isActive(index) ? styles.imageIndexActive : styles.imageIndex}>
                {index + 1}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default PdfPages;
