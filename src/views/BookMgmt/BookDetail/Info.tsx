import StyledMuiAutoTooltipTypography, {
  StyledMuiAutoTooltipTypographyProps,
} from '@/components/Styled/MuiAutoTooltipTypography';
import { diffDates } from '@/helper';
import { TFsBook, TFsTag } from '@/modules/fs/Fs';
import { PersonRounded } from '@mui/icons-material';
import {
  Box,
  Chip,
  LinearProgress,
  Skeleton,
  Stack,
  StackProps,
  Tooltip
} from '@mui/material';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';

const DetailInfoItem: FC<StackProps> = (props) => (
  <Stack
    direction="row"
    alignItems="center"
    flexWrap="wrap"
    gap={1}
    {...props}
  />
);

const DetailInfoItemText: FC<StyledMuiAutoTooltipTypographyProps> = (props) => (
  <StyledMuiAutoTooltipTypography
    variant="subtitle2"
    lineClampCount={1}
    {...props}
  />
);

export const DetailInfoSkeleton: FC<StackProps> = (props) => (
  <Stack gap={1} alignItems="flex-start" {...props}>
    <DetailInfoItem>
      <Skeleton animation="wave" height="32px" width="50px" variant="rounded" />
      <Skeleton animation="wave" height="32px" width="70px" variant="rounded" />
      <Skeleton animation="wave" height="32px" width="60px" variant="rounded" />
    </DetailInfoItem>
    <Skeleton animation="wave" height="24px" width="100px" variant="rounded" />
    <Skeleton
      animation="wave"
      height="22px"
      width="100%"
      sx={{ maxWidth: '350px' }}
      variant="rounded"
    />
  </Stack>
);

export type DetailInfoProps = {
  tags: TFsTag[];
  book: TFsBook;
  onClickTag?: (tag: TFsTag) => void;
} & StackProps;

const DetailInfo: FC<DetailInfoProps> = ({
  tags,
  book: { type, description, author, lastProcess },
  onClickTag,
  ...props
}) => {
  const { t } = useTranslation();
  const diffDate =
    lastProcess.ts && diffDates(new Date(), new Date(lastProcess.ts));
  const lastReadDate =
    lastProcess.ts && diffDate
      ? diffDate.days
        ? t('diffDate.any days ago', { days: diffDate.days })
        : diffDate.hours
        ? t('diffDate.any hours ago', { hours: diffDate.hours })
        : diffDate.minutes
        ? t('diffDate.any minutes ago', { minutes: diffDate.minutes })
        : t('diffDate.just now')
      : null;
  return (
    <Stack gap={1} alignItems="flex-start" {...props}>
      {/* 标签 */}
      <DetailInfoItem>
        <Chip label={type} sx={{ textTransform: 'uppercase' }} />
        {tags.map((tag) => (
          <Chip
            key={tag.id}
            label={tag.title}
            sx={{ background: tag.color }}
            onClick={() => onClickTag?.(tag)}
          />
        ))}
      </DetailInfoItem>

      {/* 作者 */}
      <DetailInfoItem>
        <Tooltip title={t('bookInfo.author')}>
          <PersonRounded />
        </Tooltip>
        <DetailInfoItemText lineClampCount={1}>
          {author || t('unknown author')}
        </DetailInfoItemText>
      </DetailInfoItem>

      {/* 描述 */}
      {description && (
        <DetailInfoItemText color="text.secondary" lineClampCount={3}>
          {description}
        </DetailInfoItemText>
      )}

      {/* 进度 */}
      <Stack direction="row" alignItems="center" gap={1} width={1}>
        <Box flexGrow={1}>
          <LinearProgress
            variant="determinate"
            value={lastProcess.percent * 100 || 0}
          />
        </Box>
        <DetailInfoItemText
          variant="body1"
          color="text.secondary"
          flexShrink={0}>
          {`${(lastProcess.percent * 100 || 0).toFixed(1)}%`}
        </DetailInfoItemText>
      </Stack>
      <DetailInfoItemText>{lastReadDate}</DetailInfoItemText>
    </Stack>
  );
};

export default DetailInfo;
