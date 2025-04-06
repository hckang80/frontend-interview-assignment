import { createContext } from 'react';
import type { CanvasContextType } from './CanvasProvider';

export const CanvasContext = createContext<CanvasContextType | null>(null);
