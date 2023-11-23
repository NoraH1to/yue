import useLoading from '@/hooks/useLoading';
import { Backdrop, Box, CircularProgress, styled, useMediaQuery, useTheme } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import SideBar from './Sidebar';
import { BookMgmtProvider } from './context';

const MainContainer = styled(Box, { label: 'app-main' })({
  display: 'flex',
  flexGrow: 1,
  flexFlow: 'column',
  position: 'relative',
});

const MainWrapper = styled(Box, { label: 'main-wrapper' })(({ theme }) => ({
  position: 'absolute',
  background: theme.palette.action.hover,
  flexGrow: 1,
  flexShrink: 0,
  overflow: 'hidden',
  isolation: 'isolate', // 修复 safari 上子元素溢出边框的问题
  [theme.breakpoints.up('sm')]: {
    left: theme.spacing(1),
    top: theme.spacing(1),
    right: theme.spacing(1),
    bottom: theme.spacing(1),
    borderRadius: theme.shape.borderRadius * 4,
  },
  [theme.breakpoints.down('sm')]: {
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    borderRadius: 0,
  },
}));

const BookMgmt = () => {
  const [{ loading }] = useLoading();
  const theme = useTheme();
  const matchUpSm = useMediaQuery(theme.breakpoints.up('sm'));
  const [openSidebar, setOpenSidebar] = useState(matchUpSm ? true : false);
  const toggleOpenSidebar = useCallback(
    (open?: boolean) => {
      if (open !== undefined) setOpenSidebar(open);
      else setOpenSidebar(!openSidebar);
    },
    [openSidebar],
  );
  useEffect(() => {
    if (matchUpSm) setOpenSidebar(true);
    else setOpenSidebar(false);
  }, [matchUpSm]);
  return (
    <BookMgmtProvider value={{ openSidebar, toggleOpenSidebar }}>
      <SideBar
        open={openSidebar}
        onClose={() => setOpenSidebar(false)}
        onOpen={() => setOpenSidebar(true)}
      />
      <MainContainer>
        <MainWrapper>
          <Outlet />
        </MainWrapper>
      </MainContainer>
      <Backdrop open={!!loading} sx={(theme) => ({ zIndex: theme.zIndex.drawer + 1 })}>
        <CircularProgress />
      </Backdrop>
    </BookMgmtProvider>
  );
};

export default BookMgmt;
