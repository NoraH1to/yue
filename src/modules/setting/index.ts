export type TSource = {
  type: 'webdav';
  info: { url: string; username?: string; password?: string };
};

export type TAppSetting = {
  colorMode: 'dark' | 'light' | 'system';
  readerTheme: Record<'dark' | 'light', TReaderTheme>;
  source: Record<string, TSource | undefined>;
};

export type TReaderTheme = {
  color?: string;
  backgroundColor?: string;
};
