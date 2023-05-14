import {
  Box,
  BoxProps,
  Card,
  CardActionArea,
  CardActionAreaProps,
  Fade,
  Skeleton,
  SxProps,
  Typography,
} from '@mui/material';
import { FC, forwardRef, memo, useMemo } from 'react';
import FixedRatioBookCover from '../FixedRatioWrapper/FixedRatioBookCover';
import MuiAutoTooltipTypography from '../Styled/MuiAutoTooltipTypography';
import { MemoBookItemCover } from './Cover';

const MemoMuiAutoTooltipTypography = memo(MuiAutoTooltipTypography);

export const BookItemBaseCardCoverSkeleton = forwardRef((props, ref) => (
  <FixedRatioBookCover ref={ref}>
    <Card elevation={0} variant="elevation" sx={{ height: 1, width: 1 }}>
      <Skeleton
        width="100%"
        height="100%"
        variant="rectangular"
        animation="wave"
      />
    </Card>
  </FixedRatioBookCover>
));
BookItemBaseCardCoverSkeleton.displayName = 'BookItemBaseCardCoverSkeleton';

export const BookItemBaseCardSkeleton = () => (
  <Box sx={{ userSelect: 'none' }}>
    <BookItemBaseCardCoverSkeleton />
    <Skeleton animation="wave" width="40%">
      <Typography variant="subtitle1">empty</Typography>
    </Skeleton>
  </Box>
);

export type BookItemBaseCardProps = {
  loaded: boolean;
  scaleOnHover: boolean;
  ComponentsProps?: {
    Root?: BoxProps;
  };
  image?: string;
  title: string;
  ext: string;
} & Pick<CardActionAreaProps, 'ref'> &
  CardActionAreaProps;

const BookItemBaseCard: FC<BookItemBaseCardProps> = forwardRef((props, ref) => {
  const {
    scaleOnHover,
    ComponentsProps,
    image,
    loaded,
    title,
    ext,
    ...restProps
  } = props;
  const imgSx = useMemo<SxProps>(
    () => ({
      height: 1,
      width: 1,
      userSelect: 'none',
      pointerEvents: 'none',
    }),
    [],
  );

  const Content = (
    <Box
      {...ComponentsProps?.Root}
      sx={useMemo(
        () => [
          { userSelect: 'none' },
          ...(Array.isArray(ComponentsProps?.Root?.sx)
            ? ComponentsProps!.Root!.sx
            : [ComponentsProps?.Root?.sx]),
        ],
        [ComponentsProps?.Root?.sx],
      )}>
      <FixedRatioBookCover>
        <Card
          elevation={0}
          variant="elevation"
          sx={[
            {
              height: 1,
              width: 1,
              transform: 'scale(1)',
              transitionDuration: '.2s',
              transitionProperty: 'box-shadow, transform',
              transformOrigin: '50% 100%',
            },
            scaleOnHover
              ? (theme) => ({
                  '&:hover': {
                    boxShadow: theme.shadows[24],
                    transform: 'scale(1.03)',
                  },
                })
              : {},
          ]}>
          {useMemo(
            () => (
              <CardActionArea
                {...restProps}
                sx={{ height: 1, width: 1 }}
                ref={ref}>
                <MemoBookItemCover src={image} textCover={ext} sx={imgSx} />
              </CardActionArea>
            ),
            [...Object.values(restProps), ref, image, ext, imgSx],
          )}
        </Card>
      </FixedRatioBookCover>
      <Box display="flex">
        <MemoMuiAutoTooltipTypography
          lineClampCount={1}
          pt={1}
          pl="0.025em"
          width={0}
          flexGrow={1}>
          {title}
        </MemoMuiAutoTooltipTypography>
      </Box>
    </Box>
  );

  return <Fade in={loaded}>{Content}</Fade>;
});

BookItemBaseCard.displayName = 'BookItemCard';

export const MemoBookItemBaseCard = memo(BookItemBaseCard);

export default BookItemBaseCard;
