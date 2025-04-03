import { useEffect, useState } from 'react';
import { useStore } from '@/store/index';

import './PdfPageSelector.css';
import { getImageByPdf, loadPdf } from '../utils';

const C = () => {
  const { file, setSelectedPageIndex } = useStore();
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
    <div className="C">
      <div className="top">
        {fileImages.map((image, index) => (
          <div key={index} onClick={() => setSelectedPageIndex(index + 1)}>
            <div className="image">
              <img src={image} alt="" />
            </div>
            <div className="imageIndex">{index + 1}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default C;
