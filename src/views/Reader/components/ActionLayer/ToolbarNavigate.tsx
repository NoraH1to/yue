import StyledMuiIconButton from '@/components/Styled/MuiIconButton';
import ToolbarColumn from '@/components/Toolbar/ToolbarColumn';
import ToolbarRow from '@/components/Toolbar/ToolbarRow';
import {
  NavigateBeforeRounded,
  NavigateNextRounded,
} from '@mui/icons-material';
import { Slider, Typography } from '@mui/material';
import { FC, memo } from 'react';

export type ToolbarNavigateProps = {
  onPrev: () => void;
  onNext: () => void;
  onPercent: (value: number) => void;
  onPercentCommit: (value: number) => void;
  percent: number;
  maxPercent: number;
};

const ToolbarNavigate: FC<ToolbarNavigateProps> = ({
  percent,
  onNext,
  onPercent,
  onPercentCommit,
  onPrev,
  maxPercent,
}) => {
  return (
    <ToolbarColumn>
      <ToolbarRow alignItems="center">
        <StyledMuiIconButton onClick={onPrev}>
          <NavigateBeforeRounded />
        </StyledMuiIconButton>
        <Slider
          min={0}
          max={maxPercent}
          value={percent}
          onChangeCommitted={(e, v) => onPercentCommit(v as number)}
          onChange={(e, v) => onPercent(v as number)}
        />
        <Typography>
          {`${((percent / maxPercent) * 100).toFixed(1)}%`}
        </Typography>
        <StyledMuiIconButton onClick={onNext}>
          <NavigateNextRounded />
        </StyledMuiIconButton>
      </ToolbarRow>
    </ToolbarColumn>
  );
};

export default memo(ToolbarNavigate);
