import React, { createContext } from 'react';
import * as fabric from 'fabric';

interface CanvasContextType {
  fabricCanvasRef: React.RefObject<fabric.Canvas | null>;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  initializeCanvas: (file: File, selectedPageIndex: number) => void;
  uploadStamp: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const CanvasContext = createContext<CanvasContextType | null>(null);
