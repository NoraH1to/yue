import { createContext, useContext, useRef, useState } from 'react';

import { FC, PropsWithChildren } from 'react';

const LoadingContext = createContext({
  loading: false,
  addLoading: <T extends Promise<any>>(promiseLike: T): T => promiseLike,
});

export const LoadingProvide: FC<PropsWithChildren<unknown>> = ({
  children,
}) => {
  const stack = useRef(0);
  const [loading, setLoading] = useState(!!stack.current);
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-constraint
  const addLoading = <T extends Promise<any>>(promiseLike: T): T => {
    stack.current++;
    if (!loading && !!stack) setLoading(true);
    promiseLike.finally(() => {
      !--stack.current && setLoading(false);
    });
    return promiseLike;
  };

  return (
    <LoadingContext.Provider value={{ loading, addLoading }}>
      {children}
    </LoadingContext.Provider>
  );
};

const useLoading = () => {
  const { loading, addLoading } = useContext(LoadingContext);
  return { loading, addLoading };
};

export default useLoading;
