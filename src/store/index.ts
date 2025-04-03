import { create } from 'zustand';

type Store = {
  file: File | null;
  setFile: (file: File | null) => void;
  selectedPageIndex: number;
  setSelectedPageIndex: (index: number) => void;
};

export const useStore = create<Store>((set) => ({
  file: null,
  setFile: (file: File | null) => set({ file }),
  selectedPageIndex: 1,
  setSelectedPageIndex: (index: number) => set({ selectedPageIndex: index })
}));
