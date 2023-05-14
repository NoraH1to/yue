import { mergeEventListener } from '@/helper';
import { Box, BoxProps, CardMediaProps, Fade } from '@mui/material';
import { FC, ReactElement, forwardRef, memo, useMemo, useState } from 'react';
import MemoMuiCardMedia from '../Memo/MuiCardMedia';
import StyledMuiTypography from '../Styled/MuiTypography';

export type BookItemCoverProps = {
  textCover: string;
  render?: (Cover: ReactElement) => ReactElement;
} & Pick<CardMediaProps, 'src' | 'onLoad'> &
  BoxProps;

const BookItemCover: FC<BookItemCoverProps> = forwardRef(
  ({ textCover, render, src, onLoad, ...props }, ref) => {
    const [imgLoaded, setImgLoaded] = useState(false);
    const handleImgLoaded = useMemo(
      () => mergeEventListener(() => setImgLoaded(true), onLoad),
      [setImgLoaded, onLoad],
    );

    const Cover = (
      <Box position="relative" ref={ref} {...props}>
        <Fade in={!src || !imgLoaded} unmountOnExit>
          <Box
            position="absolute"
            display="flex"
            alignItems="center"
            top={0}
            height={1}
            width={1}>
            <StyledMuiTypography
              lineClampCount={2}
              textTransform="uppercase"
              width={1}
              textAlign="center"
              color="GrayText"
              variant="h4">
              {textCover}
            </StyledMuiTypography>
          </Box>
        </Fade>
        {src && (
          <Fade in={imgLoaded}>
            <MemoMuiCardMedia
              /* @ts-ignore */
              component="img"
              src={src}
              onLoad={handleImgLoaded}
              sx={{
                height: 1,
                transform: 'translateZ(0px)', // GPU 加速消除锯齿，偶尔会失效，跟浏览器实现有关
              }}
            />
          </Fade>
        )}
      </Box>
    );
    return <Fade in={true}>{render ? render(Cover) : Cover}</Fade>;
  },
);

BookItemCover.displayName = 'BookItemCover';

export const MemoBookItemCover = memo(BookItemCover);

export default BookItemCover;
