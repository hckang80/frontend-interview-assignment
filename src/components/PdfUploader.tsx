import { useRef, useState } from 'react';
import { useStore } from '@/store/index';

import * as styles from './PdfUploader.css';
import { PDFDocument, type PDFPage } from 'pdf-lib';
import { singleton, optimizeImage } from '@/utils';

type StampType = {
  id: string;
  url: string;
};

const PdfUploader = () => {
  const { originFile, setOriginFile, setSignedFile, resetFile } = useStore();

  const stampInputRef = useRef<HTMLInputElement>(null);
  const pdfInputRef = useRef<HTMLInputElement>(null);
  const [stamps, setStamps] = useState<StampType[]>([]);
  const [selectedStampIndex, setSelectedStampIndex] = useState(0);

  const handlePDFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (!files) return;

    const [file] = files;

    resetFile();
    setOriginFile(file);

    e.target.value = '';
  };

  const handleStampUpload = () => {
    stampInputRef.current?.click();
  };

  const handleStampChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
  };

  const handlePDFUpload = () => {
    pdfInputRef.current?.click();
  };

  const handlePDFRemove = () => {
    resetFile();
  };

  const handleStampDraw = async (file: File) => {
    const fileArrayBuffer = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(fileArrayBuffer);
    const pages = pdfDoc.getPages();

    await drawStamp(pdfDoc, pages);

    const pdfBytes = await pdfDoc.save();
    const pdfBlob = new Blob([pdfBytes], { type: 'application/pdf' });
    const updatedFile = new File([pdfBlob], file.name, { type: 'application/pdf' });

    setSignedFile(updatedFile);
  };

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
        <div>
          <div className={styles.pdfUpload}>
            <input
              ref={pdfInputRef}
              type="file"
              accept=".pdf"
              onChange={handlePDFChange}
              style={{ display: 'none' }}
            />

            <button type="button" onClick={handlePDFUpload} className={styles.button}>
              PDF 업로드
            </button>
          </div>

          <div className={styles.pdfFile}>
            {!!originFile?.name && (
              <>
                📄 파일명: <strong>{originFile?.name}</strong>
                <button type="button" className={styles.pdfFileRemove} onClick={handlePDFRemove}>
                  X
                </button>
              </>
            )}
          </div>
        </div>

        <div>
          <div className={styles.stampUpload}>
            <input
              ref={stampInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleStampChange}
              style={{ display: 'none' }}
            />
            <button type="button" onClick={handleStampUpload} className={styles.button}>
              도장 업로드
            </button>
          </div>

          <div className={styles.stamps}>
            {stamps.map(({ id, url }, index) => (
              <button
                className={
                  stamps.length > 1 && index === selectedStampIndex
                    ? styles.stampButtonActive
                    : styles.stampButton
                }
                key={id}
                onClick={() => setSelectedStampIndex(index)}
              >
                <img src={url} alt="" className={styles.stampImage} />
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.bottom}>
        {originFile && (
          <button
            type="button"
            onClick={() => handleStampDraw(originFile)}
            className={styles.button}
          >
            도장 찍기
          </button>
        )}
      </div>
    </div>
  );
};

export default PdfUploader;
