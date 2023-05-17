import { useMemo } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';

export type TRouteReaderParams = {
  hash: string;
  value?: string;
  href?: string | null;
};

const useReaderParams = () => {
  const { hash } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  if (!hash) throw new Error('need book hash');
  return useMemo(() => {
    return [
      {
        hash,
        value: searchParams.get('value') || undefined,
        href: searchParams.get('href'),
      },
      searchParams,
      setSearchParams,
    ] as const;
  }, [searchParams, hash]);
};

export default useReaderParams;
