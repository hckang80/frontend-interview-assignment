import { create } from 'zustand';

type Store = {
  originFile: File | null;
  setOriginFile: (file: File | null) => void;
  signedFile: File | null;
  setSignedFile: (file: File | null) => void;
  selectedPageIndex: number;
  setSelectedPageIndex: (index: number) => void;
  printedFile: () => File | null;
};

export const useStore = create<Store>((set, get) => ({
  originFile: null,
  setOriginFile: (file: File | null) => set({ originFile: file }),
  signedFile: null,
  setSignedFile: (file: File | null) => set({ signedFile: file }),
  selectedPageIndex: 1,
  setSelectedPageIndex: (index: number) => set({ selectedPageIndex: index }),
  printedFile: () => {
    const { signedFile, originFile } = get();
    return signedFile || originFile;
  }
}));
