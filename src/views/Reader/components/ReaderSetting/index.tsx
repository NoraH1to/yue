import useSetting from '@/hooks/useSetting';
import { TReaderSetting } from '@/modules/setting';
import { Box } from '@mui/material';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { MemoReaderSettingNumberItem } from './ReaderSettingNumberItem';

const ReaderSetting = () => {
  const [{ readerSetting }, { setReaderSetting }] = useSetting();
  const { t } = useTranslation();
  const set = <T extends keyof TReaderSetting>(key: T, value: TReaderSetting[T]) => {
    setReaderSetting({ ...readerSetting, [key]: value });
  };
  return (
    <Box
      display="grid"
      gridTemplateColumns={{
        xs: 'repeat(2, 1fr)',
        md: 'repeat(4, 1fr)',
      }}
      justifyItems="center"
      gap={2}>
      <MemoReaderSettingNumberItem
        title={t('readerSetting.fontSize')}
        min={12}
        max={48}
        step={0.5}
        defaultValue={readerSetting.fontSize}
        onChange={(v) => set('fontSize', v)}
      />
      <MemoReaderSettingNumberItem
        title={t('readerSetting.letterGap')}
        min={0}
        max={5}
        step={0.1}
        defaultValue={readerSetting.letterGap}
        onChange={(v) => set('letterGap', v)}
      />
      <MemoReaderSettingNumberItem
        title={t('readerSetting.lineHeight')}
        min={1}
        max={5}
        step={0.1}
        defaultValue={readerSetting.lineHeight}
        onChange={(v) => set('lineHeight', v)}
      />
      <MemoReaderSettingNumberItem
        title={t('readerSetting.paragraphGap')}
        min={0}
        max={80}
        step={1}
        defaultValue={readerSetting.paragraphGap}
        onChange={(v) => set('paragraphGap', v)}
      />
      {/* TODO: 垂直\水平外边距，epubjs 的实现让这玩意很难搞 */}
    </Box>
  );
};

export default memo(ReaderSetting);
