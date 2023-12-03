import { MemoDirItemDirBaseCard } from '@/components/DirItem/DirBaseCard';
import { shallowEqual } from '@/helper';
import { TFsItemDir } from '@/modules/fs/Fs';
import { ROUTE_PATH } from '@/router';
import { FC, memo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

export type DirCardProps = {
  dirItem: TFsItemDir;
};

const DirCard: FC<DirCardProps> = ({ dirItem }) => {
  const nav = useNavigate();
  const handleClick = useCallback(() => {
    nav(`/${ROUTE_PATH.DIR}/${encodeURIComponent(dirItem.filename)}`);
  }, [dirItem.filename]);
  return <MemoDirItemDirBaseCard dirname={dirItem.basename} onClick={handleClick} />;
};

export default memo(DirCard, ({ dirItem: pd }, { dirItem: nd }) => shallowEqual(pd, nd));
