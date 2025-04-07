export type FileImage = {
  id: string;
  url: string;
};

export type Stamp = {
  file: File;
} & FileImage;
