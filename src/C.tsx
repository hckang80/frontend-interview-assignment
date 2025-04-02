import { useEffect, useState } from 'react';
import { useStore } from '@/store';

import './C.css';
import { getImageByPdf, loadPdf } from './utils';

const C = () => {
  const { file } = useStore();
  const [fileImage, setFileImage] = useState<string | null>(null);

  useEffect(() => {
    if (!file) return;

    (async () => {
      const { totalPages, pdf } = await loadPdf(file);
      console.log({ totalPages });
      setFileImage((await getImageByPdf(pdf)) ?? '');
    })();
  }, [file]);

  return (
    <div className="C">
      <div className="top">
        {fileImage && (
          <div>
            <div className="image">
              <img src={fileImage} />
            </div>
            <div className="imageIndex">1</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default C;
