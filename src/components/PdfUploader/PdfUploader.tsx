import React, { useState, useCallback } from 'react';
import { useStore } from '@/store/index';

import * as styles from './PdfUploader.css';
import { PDFDocument } from 'pdf-lib';
import { singleton, optimizeImage, canvasToFile } from '@/utils';
import { PdfUpload, StampUpload, StampDraw } from '.';
import { Stamp } from '@/types';
import { useCanvasContext } from '@/context/useCanvasContext';

const PdfUploader = () => {
  const { originFile, setOriginFile, setSignedFile, resetFile } = useStore();
  const { fabricCanvasRef } = useCanvasContext();

  const [stamps, setStamps] = useState<Stamp[]>([]);
  const [selectedStampIndex, setSelectedStampIndex] = useState(0);

  const handlePDFRemove = () => {
    resetFile();
    setSelectedStampIndex(0);
  };

  const handleStampChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const { files } = e.target;
      if (!files || files.length === 0) return;

      const newStamps = await Promise.all(
        Array.from(files).map(async (file) => ({
          id: crypto.randomUUID(),
          url: await singleton(optimizeImage)(file),
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

  const getUpdatedFile = useCallback(
    async (file: File) => {
      const fileArrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(fileArrayBuffer);
      const pdfBytes = await pdfDoc.save();
      const pdfBlob = new Blob([pdfBytes], { type: 'application/pdf' });

      return new File([pdfBlob], file.name, { type: 'application/pdf' });
    },
    [stamps, selectedStampIndex]
  );

  const handleStampDraw = useCallback(async () => {
    const canvas = fabricCanvasRef?.current;
    if (!canvas) return;

    const file = await canvasToFile(canvas);
    const signedFile = await getUpdatedFile(file);

    setSignedFile(signedFile);
  }, [setSignedFile, getUpdatedFile]);

  return (
    <div className={styles.container}>
      <div className={styles.top}>
        <PdfUpload
          originFile={originFile}
          setOriginFile={setOriginFile}
          handlePDFRemove={handlePDFRemove}
        />
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
