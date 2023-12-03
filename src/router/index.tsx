import StatusUnCatchError from '@/components/Status/StatusUnCatchError';
import StatusUnExistPage from '@/components/Status/StatusUnExistPage';
import AppView from '@/views';
import About from '@/views/About';
import BookMgmt from '@/views/BookMgmt';
import BookDetail from '@/views/BookMgmt/BookDetail';
import BookListAll from '@/views/BookMgmt/BookListAll';
import BookListRecentReads from '@/views/BookMgmt/BookListRecentReads';
import BookListTag from '@/views/BookMgmt/BookListTag';
import Dir from '@/views/BookMgmt/Dir';
import Reader from '@/views/Reader';
import Setting from '@/views/Setting';
import { Navigate, createBrowserRouter } from 'react-router-dom';

// TODO: 切换路由后保留组件状态

export enum ROUTE_PATH {
  ROOT = '/',
  TAG = 'tag',
  RECENT = 'recent',
  DETAIL = 'detail',
  DIR = 'dir',
  READER = 'reader',
  SETTING = 'setting',
  ABOUT = 'about',
}

const router = createBrowserRouter([
  {
    path: ROUTE_PATH.ROOT,
    element: <AppView />,
    errorElement: <StatusUnCatchError />,
    children: [
      {
        path: ROUTE_PATH.ROOT,
        element: <BookMgmt />,
        errorElement: <StatusUnCatchError />,
        children: [
          { index: true, element: <BookListAll /> },
          { path: `${ROUTE_PATH.RECENT}`, element: <BookListRecentReads /> },
          {
            path: `${ROUTE_PATH.TAG}`,
            element: <StatusUnExistPage />,
          },
          {
            path: `${ROUTE_PATH.TAG}/:id`,
            element: <BookListTag />,
          },
          {
            path: `${ROUTE_PATH.DETAIL}`,
            element: <StatusUnExistPage />,
          },
          {
            path: `${ROUTE_PATH.DETAIL}/:hash`,
            element: <BookDetail />,
          },
          {
            path: `${ROUTE_PATH.DIR}`,
            element: <Navigate to={`/${ROUTE_PATH.DIR}/${encodeURIComponent('/')}`} replace />,
          },
          {
            path: `${ROUTE_PATH.DIR}/:filename`,
            element: <Dir />,
          },
          {
            path: ROUTE_PATH.SETTING,
            element: <Setting />,
          },
          {
            path: ROUTE_PATH.ABOUT,
            element: <About />,
          },
        ],
      },
      { path: `${ROUTE_PATH.READER}`, element: <StatusUnExistPage /> },
      {
        path: `${ROUTE_PATH.READER}/:hash`,
        element: <Reader />,
        errorElement: <StatusUnCatchError />,
      },
    ],
  },
]);

export default router;
