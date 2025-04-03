import { useRef, useState } from 'react';
import { useStore } from '@/store/index';

import './PdfUploader.css';
import { PDFDocument, rgb, degrees, type PDFPage } from 'pdf-lib';

const A = () => {
  const { file, setFile } = useStore();

  const stampInputRef = useRef<HTMLInputElement>(null);
  const pdfInputRef = useRef<HTMLInputElement>(null);
  const [stamps, setStamps] = useState<string[]>([]);
  const [selectedStampIndex, setSelectedStampIndex] = useState(0);

  const handlePDFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    setFile(file!);

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
    setFile(null);
  };

  const handleStampDraw = async (file: File) => {
    const fileArrayBuffer = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(fileArrayBuffer);
    const pages = pdfDoc.getPages();

    drawStamp(pages);

    const pdfBytes = await pdfDoc.save();
    const pdfBlob = new Blob([pdfBytes], { type: 'application/pdf' });
    const updatedFile = new File([pdfBlob], `signed_${file.name}`, { type: 'application/pdf' });

    setFile(updatedFile);
  };

  const drawStamp = (pages: PDFPage[]) => {
    pages.forEach((page, index) => {
      page.drawText(`Page ${index + 1}: Added text by JavaScript`, {
        x: 50,
        y: 500,
        size: 24,
        color: rgb(0.1, 0.1, 0.95),
        rotate: degrees(0)
      });
    });
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
            {!!file?.name && (
              <>
                📄 파일명: <strong>{file?.name}</strong>
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
        {file && (
          <button type="button" onClick={() => handleStampDraw(file)}>
            도장 찍기
          </button>
        )}
      </div>
    </div>
  );
};

export default A;
