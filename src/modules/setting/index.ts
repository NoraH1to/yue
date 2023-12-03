export type TSource = {
  name: string;
  type: 'webdav';
  info: {
    url: string;
    dirBasePath?: string;
    username?: string;
    password?: string;
  };
};

export type TAppSetting = {
  colorMode: 'dark' | 'light' | 'system';
  readerTheme: Record<'dark' | 'light', TReaderTheme>;
  readerSetting: TReaderSetting;
  source: TSource[];
  autoSyncProcess: boolean;
  sourceDataDir: string;
};

export type TReaderTheme = {
  color?: string;
  backgroundColor?: string;
};

/**
 * `fontSize` 绝对值
 * `lineHeight` 百分比，1 = 100%
 * `letterGap` 百分比，同上
 * `paragraphGap` 绝对值
 * `verticalMargin` 绝对值
 * `horizontalMargin` 绝对值
 */
export type TReaderSetting = {
  fontSize: number;
  lineHeight: number;
  letterGap: number;
  paragraphGap: number;
  verticalMargin: number;
  horizontalMargin: number;
};
