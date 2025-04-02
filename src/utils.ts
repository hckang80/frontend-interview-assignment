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
  }
};

export const getImageByPdf = async (
  pdf: pdfjsLib.PDFDocumentProxy,
  pageNumber = 1
): Promise<string> => {
  try {
    const page = await pdf.getPage(pageNumber);
    const viewport = page.getViewport({ scale: 1 });

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

export const pdfFileToImage = async (
  file: File
): Promise<{
  image: string;
  error: string | null;
  fileName: string;
}> => {
  const pdfUrl = URL.createObjectURL(file);

  const pdf = await pdfjsLib.getDocument(pdfUrl).promise;

  const renderPageToImage = async (): Promise<string> => {
    const page = await pdf.getPage(1);

    const viewport = page.getViewport({ scale: 1 });

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    canvas.width = viewport.width;
    canvas.height = viewport.height;

    await page.render({ canvasContext: context!, viewport }).promise;

    return canvas.toDataURL('image/png');
  };

  return {
    image: await renderPageToImage(),
    error: null,
    fileName: file.name
  };
};

export const getImageByFile = async (file: File): Promise<string | undefined> => {
  const result = await pdfFileToImage(file);

  return result.image;
};
