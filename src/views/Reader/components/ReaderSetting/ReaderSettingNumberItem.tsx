import StyledMuiIconButton from '@/components/Styled/MuiIconButton';
import { add, subtract } from '@/helper';
import { AddRounded, RemoveRounded } from '@mui/icons-material';
import { Stack } from '@mui/material';
import { FC, memo, useState } from 'react';
import ReaderSettingItem, { ReaderSettingItemProps } from './ReaderSettingItem';
import ReaderSettingItemValue from './ReaderSettingItemValue';

export type ReaderSettingNumberItemProps = {
  defaultValue: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
} & Omit<ReaderSettingItemProps, 'children'>;

const ReaderSettingNumberItem: FC<ReaderSettingNumberItemProps> = ({
  defaultValue,
  min,
  max,
  step,
  onChange,
  ...props
}) => {
  const [value, setValue] = useState(defaultValue);
  const onAdd = () => {
    const newValue = value < max ? add(value, step) : value;
    if (newValue === value) return;
    setValue(newValue);
    onChange(newValue);
  };
  const onDecrease = () => {
    const newValue = value > min ? subtract(value, step) : value;
    if (newValue === value) return;
    setValue(newValue);
    onChange(newValue);
  };
  return (
    <ReaderSettingItem {...props}>
      <Stack direction="row" alignItems="center" justifyContent="center" gap={1}>
        <StyledMuiIconButton disabled={value <= min} onClick={onDecrease}>
          <RemoveRounded />
        </StyledMuiIconButton>
        <ReaderSettingItemValue width="3em">{value}</ReaderSettingItemValue>
        <StyledMuiIconButton disabled={value >= max} onClick={onAdd}>
          <AddRounded />
        </StyledMuiIconButton>
      </Stack>
    </ReaderSettingItem>
  );
};

export const MemoReaderSettingNumberItem = memo(ReaderSettingNumberItem);

export default ReaderSettingNumberItem;
