import { mergeEventListener, preventDefault } from '@/helper';
import { Backdrop, Paper, Slide, Stack, lighten, styled } from '@mui/material';
import { FC, ReactNode, memo, useCallback, useMemo } from 'react';

export type ActionLayerProps = {
  open: boolean;
  onClose: () => void;
  ContentBottom: ReactNode;
  ContentTop: ReactNode;
};

const prevent = preventDefault();

const ContentWrapper = styled(Paper)(({ theme }) => ({
  position: 'absolute',
  maxWidth: '900px',
  width: '100%',
  margin: '0 auto',
  borderRadius: theme.shape.borderRadius * 4,
  backgroundColor: lighten(theme.palette.background.paper, 0.1),
  overflow: 'hidden',
  padding: theme.spacing(2),
}));

const ActionLayer: FC<ActionLayerProps> = ({ open, onClose, ContentBottom, ContentTop }) => {
  const handleClickBackdrop = useCallback(mergeEventListener(onClose, prevent), [onClose, prevent]);
  return (
    <Backdrop open={open} onClick={handleClickBackdrop}>
      <Slide in={open}>
        <ContentWrapper
          sx={useMemo(
            () => ({
              top: 0,
              borderTopLeftRadius: 0,
              borderTopRightRadius: 0,
            }),
            [],
          )}
          onClick={prevent}>
          {ContentTop}
        </ContentWrapper>
      </Slide>
      <Slide in={open} direction="up">
        <ContentWrapper
          sx={useMemo(
            () => ({
              bottom: 0,
              borderBottomLeftRadius: 0,
              borderBottomRightRadius: 0,
            }),
            [],
          )}
          onClick={prevent}>
          <Stack gap={1}>{ContentBottom}</Stack>
        </ContentWrapper>
      </Slide>
    </Backdrop>
  );
};

export default memo(ActionLayer);
