import {
  Card,
  CardActionArea,
  CardActionAreaProps,
  Fade,
  styled,
} from '@mui/material';
import { FC, PropsWithChildren, ReactNode, memo } from 'react';
import { MemoBookItemCover } from '../BookItem/Cover';
import FixedRatioBookCover from '../FixedRatioWrapper/FixedRatioBookCover';
import ItemTitle from './ItemTitle';

export type FileBaseCardProps = PropsWithChildren<
  {
    cover?: string;
    ext?: string;
    title: string;
    coverChildren?: ReactNode;
  } & CardActionAreaProps
>;

const ClickAreaWrapper = styled(Card)({
  background: 'transparent',
  height: '100%',
  position: 'relative',
  isolation: 'isolate', // 修复 safari 上子元素溢出边框的问题
});

const ClickArea = styled(CardActionArea)(({ theme }) => ({
  height: '100%',
  padding: theme.spacing(1),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'stretch',
  justifyContent: 'flex-start',
}));

const CoverCardWrapper = styled(Card)({
  height: '100%',
  width: '100%',
  position: 'relative',
  isolation: 'isolate', // 修复 safari 上子元素溢出边框的问题
});

const StyledCover = styled(MemoBookItemCover)({
  height: '100%',
  width: '100%',
  userSelect: 'none',
  pointerEvents: 'none',
});

const StyledTitle = styled(ItemTitle)(({ theme }) => ({
  padding: theme.spacing(0, 1),
  marginTop: theme.spacing(1),
  width: '100%',
}));

const DirItemFileBaseCard: FC<FileBaseCardProps> = ({
  children,
  ext,
  cover,
  title,
  coverChildren,
  ...props
}) => {
  return (
    <Fade in={true}>
      <ClickAreaWrapper elevation={0}>
        <ClickArea {...props}>
          <FixedRatioBookCover>
            <CoverCardWrapper variant="outlined">
              <StyledCover textCover={ext || title} src={cover} />
              {coverChildren}
            </CoverCardWrapper>
          </FixedRatioBookCover>
          <StyledTitle>{title}</StyledTitle>
          {children}
        </ClickArea>
      </ClickAreaWrapper>
    </Fade>
  );
};

export const MemoDirItemFileBaseCard = memo(DirItemFileBaseCard);

export default DirItemFileBaseCard;
