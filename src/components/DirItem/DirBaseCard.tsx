import { FolderRounded } from '@mui/icons-material';
import {
  Box,
  Card,
  CardActionArea,
  CardActionAreaProps,
  Fade,
  Skeleton,
} from '@mui/material';
import { FC, memo } from 'react';
import FixedRatio from '../FixedRatioWrapper';
import MuiTypography from '../Styled/MuiTypography';
import ItemTitle from './ItemTitle';

export const DirItemDirBaseCardSkeleton = () => (
  <Box height={1}>
    <FixedRatio fixedWidth={4} fixedHeight={3}>
      <Card elevation={0} sx={{ height: 1, background: 'transparent' }}>
        <Skeleton
          variant="rounded"
          sx={{ width: 1, height: 1 }}
          animation="wave"
        />
      </Card>
    </FixedRatio>
    <MuiTypography variant="subtitle1">
      <Skeleton animation="wave" />
    </MuiTypography>
  </Box>
);

export type DirItemDirBaseCardProps = { dirname: string } & Pick<
  CardActionAreaProps,
  'onClick'
>;

const DirItemDirBaseCard: FC<DirItemDirBaseCardProps> = ({
  dirname,
  onClick,
}) => {
  return (
    <Fade in={true}>
      <Card elevation={0} sx={{ background: 'transparent', height: 1 }}>
        <CardActionArea onClick={onClick} sx={{ height: 1 }}>
          <FixedRatio fixedWidth={4} fixedHeight={3}>
            <Box
              width={1}
              height={1}
              display="flex"
              alignItems="center"
              justifyContent="center">
              <FolderRounded color="primary" sx={{ width: 1, height: 1 }} />
            </Box>
          </FixedRatio>
          <Box display="flex">
            <ItemTitle mb={1} px={2} width={1} height="56px">
              {dirname}
            </ItemTitle>
          </Box>
        </CardActionArea>
      </Card>
    </Fade>
  );
};

export const MemoDirItemDirBaseCard = memo(DirItemDirBaseCard);

export default DirItemDirBaseCard;
