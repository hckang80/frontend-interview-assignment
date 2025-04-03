import React, { useState, useCallback } from 'react';
import { useStore } from '@/store/index';

import * as styles from './PdfUploader.css';
import { PDFDocument, type PDFPage } from 'pdf-lib';
import { singleton, optimizeImage } from '@/utils';
import { PdfUpload, StampUpload, StampDraw } from '.';

type StampType = {
  id: string;
  url: string;
};

const PdfUploader = () => {
  const { originFile, setOriginFile, setSignedFile, resetFile } = useStore();

  const [stamps, setStamps] = useState<StampType[]>([]);
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
          url: await singleton(optimizeImage)(file)
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
      const pages = pdfDoc.getPages();

      await drawStamp(pdfDoc, pages);

      const pdfBytes = await pdfDoc.save();
      const pdfBlob = new Blob([pdfBytes], { type: 'application/pdf' });
      return new File([pdfBlob], file.name, { type: 'application/pdf' });
    },
    [stamps, selectedStampIndex]
  );

  const handleStampDraw = useCallback(
    async (file: File) => {
      setSignedFile(await getUpdatedFile(file));
    },
    [setSignedFile, getUpdatedFile]
  );

  const drawStamp = async (pdfDoc: PDFDocument, pages: PDFPage[]) => {
    for (const page of pages) {
      const stamp = stamps[selectedStampIndex];

      try {
        const response = await fetch(stamp.url);
        const imageData = await response.arrayBuffer();
        const embeddedImage = await pdfDoc.embedPng(imageData);

        const { width: pageWidth, height: pageHeight } = page.getSize();

        const scaledWidth = pageWidth * 0.3;
        const scaledHeight = (embeddedImage.height / embeddedImage.width) * scaledWidth;

        const x = (pageWidth - scaledWidth) / 2;
        const y = (pageHeight - scaledHeight) / 2;

        page.drawImage(embeddedImage, {
          x,
          y,
          width: scaledWidth,
          height: scaledHeight
        });
      } catch (error) {
        console.error('Failed to process stamp:', stamp, error);
      }
    }
  };

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
        <StampDraw originFile={originFile} stamps={stamps} handleStampDraw={handleStampDraw} />
      </div>
    </div>
  );
};

export default PdfUploader;
