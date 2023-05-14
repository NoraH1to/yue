import { FC, forwardRef } from 'react';
import FixedRatio, { FixedRatioProps } from '.';

const FixedRatioBookCover: FC<FixedRatioProps> = forwardRef((props, ref) => (
  <FixedRatio ref={ref} {...props} fixedWidth={119} fixedHeight={160} />
));

FixedRatioBookCover.displayName = 'FixedRatioBookCover';

export default FixedRatioBookCover;
