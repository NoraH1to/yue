export type TAppSetting = {
  colorMode: 'dark' | 'light' | 'system';
  readerTheme: Record<'dark' | 'light', TReaderTheme>;
};

export type TReaderTheme = {
  color?: string;
  backgroundColor?: string;
};
