import { useRef, useState } from 'react';
import { useStore } from '@/store/index';

import './PdfUploader.css';
import { PDFDocument, type PDFPage } from 'pdf-lib';
import { convertToPng } from '@/utils';

const A = () => {
  const { originFile, setOriginFile, setSignedFile } = useStore();

  const stampInputRef = useRef<HTMLInputElement>(null);
  const pdfInputRef = useRef<HTMLInputElement>(null);
  const [stamps, setStamps] = useState<string[]>([]);
  const [selectedStampIndex, setSelectedStampIndex] = useState(0);

  const handlePDFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (!files) return;

    const [file] = files;

    setOriginFile(file);

    e.target.value = '';
  };

  const handleStampUpload = () => {
    stampInputRef.current?.click();
  };

  const handleStampChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (!files || files.length === 0) return;

    const newStamps = Array.from(files).map((file) => URL.createObjectURL(file));

    setStamps((prevStamps) => {
      prevStamps.forEach((stamp) => URL.revokeObjectURL(stamp));
      const updatedStamps = [...prevStamps, ...newStamps];
      return updatedStamps.slice(0, 5);
    });

    e.target.value = '';
  };

  const handlePDFUpload = () => {
    pdfInputRef.current?.click();
  };

  const handlePDFRemove = () => {
    setOriginFile(null);
    setSignedFile(null);
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
        const pngDataUrl = await convertToPng(stamp);
        const response = await fetch(pngDataUrl);
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
    <div className="A">
      <div className="top">
        <div>
          <div className="pdfUpload">
            <input
              ref={pdfInputRef}
              type="file"
              accept=".pdf, .png"
              onChange={handlePDFChange}
              style={{ display: 'none' }}
            />

            <button type="button" onClick={handlePDFUpload}>
              PDF 업로드
            </button>
          </div>

          <div className="pdfFile">
            {!!originFile?.name && (
              <>
                📄 파일명: <strong>{originFile?.name}</strong>
                <button type="button" className="pdfFileRemove" onClick={handlePDFRemove}>
                  X
                </button>
              </>
            )}
          </div>
        </div>

        <div>
          <div className="stampUpload">
            <input
              ref={stampInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleStampChange}
              style={{ display: 'none' }}
            />
            <button type="button" onClick={handleStampUpload}>
              도장 업로드
            </button>
          </div>

          <div className="stamps">
            {stamps.map((stamp, index) => (
              <button
                className={index === selectedStampIndex ? 'active' : ''}
                key={index}
                onClick={() => setSelectedStampIndex(index)}
              >
                <img src={stamp} alt="" />
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="bottom">
        {originFile && (
          <button type="button" onClick={() => handleStampDraw(originFile)}>
            도장 찍기
          </button>
        )}
      </div>
    </div>
  );
};

export default A;
