import React, { useState, useCallback } from 'react';
import { useFileStore } from '@/store';

import * as styles from './PdfUploader.css';
import { optimizeImage, applyStampToPdf } from '@/utils';
import { PdfUpload, StampUpload, StampDraw } from '.';
import { Stamp } from '@/types';
import { useCanvasContext } from '@/context/useCanvasContext';

const PdfUploader = () => {
  const { previewFile, setSignedFile, selectedPageFileIndex } = useFileStore();
  const file = previewFile();
  const { fabricCanvasRef } = useCanvasContext();

  const [stamps, setStamps] = useState<Stamp[]>([]);
  const [selectedStampIndex, setSelectedStampIndex] = useState(0);

  const handleStampChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const { files } = e.target;
      if (!files || files.length === 0) return;

      const newStamps = await Promise.all(
        Array.from(files).map(async (file) => ({
          id: crypto.randomUUID(),
          url: await optimizeImage(file),
          file
        }))
      );

      setStamps((prevStamps) => {
        prevStamps.forEach((stamp) => URL.revokeObjectURL(stamp.url));
        const updatedStamps = [...prevStamps, ...newStamps];
        return updatedStamps.slice(-5);
      });

      e.target.value = '';
    },
    [setStamps]
  );

  const handleStampDraw = useCallback(async () => {
    const canvas = fabricCanvasRef?.current;
    if (!file || !canvas) return;

    const updatedFile = await applyStampToPdf({
      canvas,
      originFile: file,
      pageNumber: selectedPageFileIndex
    });

    setSignedFile(updatedFile);
  }, [file, selectedPageFileIndex]);

  return (
    <div className={styles.container}>
      <div className={styles.top}>
        <PdfUpload stamp={stamps[selectedStampIndex]} />
        <StampUpload
          stamps={stamps}
          selectedStampIndex={selectedStampIndex}
          setSelectedStampIndex={setSelectedStampIndex}
          handleStampChange={handleStampChange}
        />
      </div>

      <div className={styles.bottom}>
        <StampDraw stamps={stamps} handleStampDraw={handleStampDraw} />
      </div>
    </div>
  );
};

export default PdfUploader;
