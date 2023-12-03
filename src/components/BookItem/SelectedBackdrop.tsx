import { DoneRounded } from '@mui/icons-material';
import { Backdrop, Card, CardActionArea, CardActionAreaProps, Fade } from '@mui/material';
import { BoxProps } from '@mui/system';
import { FC, memo } from 'react';
import FixedRatioBookCover from '../FixedRatioWrapper/FixedRatioBookCover';

export type BookItemSelectedBackdropProps = {
  show: boolean;
  onClick?: CardActionAreaProps['onClick'];
} & Pick<BoxProps, 'position'>;

const BookItemSelectedBackdrop: FC<BookItemSelectedBackdropProps> = ({
  show,
  position = 'absolute',
  onClick,
}) => {
  return (
    <Fade in={show} unmountOnExit>
      <FixedRatioBookCover position={position} top={0} width={1}>
        <Card
          sx={{
            width: 1,
            height: 1,
            background: 'transparent',
            isolation: 'isolate', // 修复 safari 上子元素溢出边框的问题
          }}
          elevation={0}>
          <CardActionArea
            sx={{ height: 1, width: 1 }}
            onClick={onClick}
            onContextMenu={(e) => e.preventDefault()}>
            <Backdrop sx={{ position: 'absolute' }} open={show}>
              <DoneRounded color="primary" sx={{ width: 0.5, height: 0.5 }} />
            </Backdrop>
          </CardActionArea>
        </Card>
      </FixedRatioBookCover>
    </Fade>
  );
};

export const MemoBookItemSelectedBackdrop = memo(BookItemSelectedBackdrop);

export default BookItemSelectedBackdrop;
