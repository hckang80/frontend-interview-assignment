import React, { useRef, ReactNode } from 'react';
import * as fabric from 'fabric';
import { getImageByPdf, loadPdf } from '@/utils';
import { CanvasContext } from './CanvasContext';

const FABRIC_CANVAS_WIDTH = 500;
const FABRIC_CANVAS_HEIGHT = parseFloat((FABRIC_CANVAS_WIDTH * Math.sqrt(2)).toFixed(2));

export const CanvasProvider = ({ children }: { children: ReactNode }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<fabric.Canvas | null>(null);

  const initializeCanvas = (file: File, selectedPageIndex: number) => {
    if (!file || !canvasRef.current) return;

    fabricCanvasRef.current = new fabric.Canvas(canvasRef.current, {
      width: FABRIC_CANVAS_WIDTH,
      height: FABRIC_CANVAS_HEIGHT,
      selection: false
    });

    (async () => {
      const { pdf } = await loadPdf(file);
      const image = await getImageByPdf(pdf, selectedPageIndex);

      const img = await fabric.FabricImage.fromURL(image!);
      const scaleX = FABRIC_CANVAS_WIDTH / img.width;
      const scaleY = FABRIC_CANVAS_HEIGHT / img.height;

      img.set({
        scaleX,
        scaleY,
        left: 0,
        top: 0,
        objectCaching: false
      });

      if (fabricCanvasRef.current) {
        fabricCanvasRef.current.backgroundImage = img;
        fabricCanvasRef.current.requestRenderAll();
        fabricCanvasRef.current.renderAll();
      }
    })();
  };

  function uploadStamp(e: React.ChangeEvent<HTMLInputElement>) {
    const { current: canvas } = fabricCanvasRef;

    if (!canvas || !e.target.files) return;

    const [file] = e.target.files;
    const reader = new FileReader();

    reader.onload = async (e) => {
      if (!e.target?.result) return;

      const image = await fabric.FabricImage.fromURL(e.target.result.toString());

      canvas.add(image);
      canvas.centerObject(image);
      canvas.setActiveObject(image);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  }

  return (
    <CanvasContext.Provider
      value={{
        fabricCanvasRef,
        canvasRef,
        initializeCanvas,
        uploadStamp
      }}
    >
      {children}
    </CanvasContext.Provider>
  );
};
