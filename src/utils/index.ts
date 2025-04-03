import { PDFDocument } from 'pdf-lib';
import * as pdfjsLib from 'pdfjs-dist';
import workerSrc from 'pdfjs-dist/build/pdf.worker?url';

pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc;

export const loadPdf = async (
  file: File
): Promise<{
  pdf: pdfjsLib.PDFDocumentProxy;
  totalPages: number;
}> => {
  const pdfUrl = URL.createObjectURL(file);

  try {
    const pdf = await pdfjsLib.getDocument(pdfUrl).promise;
    return {
      pdf,
      totalPages: pdf.numPages
    };
  } catch (error) {
    console.error('Error loading PDF:', error);
    throw new Error('Failed to load PDF file.');
  } finally {
    URL.revokeObjectURL(pdfUrl);
  }
};

export const getImageByPdf = async (
  pdf: pdfjsLib.PDFDocumentProxy,
  pageNumber = 1
): Promise<string> => {
  try {
    const page = await pdf.getPage(pageNumber);
    const viewport = page.getViewport({ scale: 3 });

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    canvas.width = viewport.width;
    canvas.height = viewport.height;

    await page.render({ canvasContext: context!, viewport }).promise;

    return canvas.toDataURL('image/png');
  } catch (error) {
    console.error(`Error rendering page ${pageNumber}:`, error);
    throw new Error(`Failed to render page ${pageNumber}.`);
  }
};

export const downloadPdf = async (file: File) => {
  if (!file) return;

  try {
    const pdfDoc = await PDFDocument.create();

    const { pdf, totalPages } = await loadPdf(file);

    for (let pageNumber = 1; pageNumber <= totalPages; pageNumber++) {
      const image = await getImageByPdf(pdf, pageNumber);
      const imageBytes = await fetch(image).then((res) => res.arrayBuffer());
      const pdfImage = await pdfDoc.embedPng(imageBytes);

      const { width, height } = pdfImage.scale(1);
      const page = pdfDoc.addPage([width, height]);

      page.drawImage(pdfImage, {
        x: 0,
        y: 0,
        width,
        height
      });
    }

    const pdfBytes = await pdfDoc.save();

    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = file.name;
    link.click();

    URL.revokeObjectURL(link.href);
  } catch (error) {
    console.error('Error generating PDF:', error);
  }
};

export const optimizeImage = (file: File, maxWidth = 200, maxHeight = 200): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    const objectUrl = URL.createObjectURL(file);
    img.src = objectUrl;

    const cleanup = () => {
      URL.revokeObjectURL(objectUrl);
    };

    const processImage = () => {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        let { width, height } = img;

        if (width > maxWidth || height > maxHeight) {
          if (width / height > maxWidth / maxHeight) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          } else {
            width = (width * maxHeight) / height;
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;

        if (!ctx) {
          throw new Error('Canvas context not available');
        }

        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/png'));
      } catch (error) {
        reject(error);
      } finally {
        cleanup();
      }
    };

    img.onload = processImage;
    img.onerror = (error) => {
      reject(error);
    };
  });
};

export const singleton = (() => {
  let instance: any = null;

  return <T>(fn: T): T => {
    if (!instance) {
      instance = fn;
    }
    return instance;
  };
})();
