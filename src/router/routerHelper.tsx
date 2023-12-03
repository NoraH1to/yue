import { NavigateFunction } from 'react-router-dom';
import { TRouteReaderParams } from './hooks/useReaderParams';
import { ROUTE_PATH } from '.';

export const gotoReader = (nav: NavigateFunction, { hash, href, value }: TRouteReaderParams) => {
  let path = `/${ROUTE_PATH.READER}/${hash}?`;
  value && (path = path.concat(`&value=${value}`));
  href && (path = path.concat(`&href=${encodeURIComponent(href)}`));
  nav(path);
};
