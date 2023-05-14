import { useMemo } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';

export type TRouteReaderParams = [
  params: {
    hash: string;
    value?: string;
    href?: string | null;
  },
  searchParams: URLSearchParams,
  setSearchParams: ReturnType<typeof useSearchParams>[1],
];

const useReaderParams = (): TRouteReaderParams => {
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
    ];
  }, [searchParams, hash]);
};

export default useReaderParams;
