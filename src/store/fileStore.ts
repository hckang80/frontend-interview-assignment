import { create } from 'zustand';

type Store = {
  originFile: File | null;
  setOriginFile: (file: File | null) => void;
  signedFile: File | null;
  setSignedFile: (file: File | null) => void;
  selectedPageFileIndex: number;
  setSelectedPageFileIndex: (index: number) => void;
  previewFile: () => File | null;
  resetFile: () => void;
};

export const useFileStore = create<Store>((set, get) => ({
  originFile: null,
  setOriginFile: (file: File | null) => set({ originFile: file }),
  signedFile: null,
  setSignedFile: (file: File | null) => set({ signedFile: file }),
  selectedPageFileIndex: 1,
  setSelectedPageFileIndex: (index: number) => set({ selectedPageFileIndex: index }),
  previewFile: () => {
    const { signedFile, originFile } = get();
    return signedFile || originFile;
  },
  resetFile: () => {
    const { setOriginFile, setSignedFile, setSelectedPageFileIndex } = get();
    setOriginFile(null);
    setSignedFile(null);
    setSelectedPageFileIndex(1);
  }
}));
