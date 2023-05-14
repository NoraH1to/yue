import StyledMuiListItemButton from '@/components/Styled/MuiListItemButton';
import StyledMuiSwipeableDrawer from '@/components/Styled/MuiSwipeableDrawer';
import useImportBook from '@/hooks/useImportBook';
import { ROUTE_PATH } from '@/router';
import { FolderOpenRounded, MenuBookRounded } from '@mui/icons-material';
import {
  Box,
  Button,
  Grow,
  GrowProps,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  styled,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { useSnackbar } from 'notistack';
import { CSSProperties, FC, ReactNode, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { To, useLocation, useNavigate } from 'react-router-dom';
import Footer from './Footer';
import TagList from './TagList';
import RouterLink from './components/RouterLink';

const SideBarContainer = styled(Box, { label: 'side-bar-container' })(
  ({ theme }) => ({
    transition: 'width .1s',
    [theme.breakpoints.up('xs')]: {
      width: 0,
      opacity: 0,
    },
    [theme.breakpoints.up('sm')]: {
      width: '180px',
      opacity: 1,
    },
    [theme.breakpoints.up('md')]: {
      width: '250px',
    },
  }),
);

const SideBar: FC<{
  open: boolean;
  onClose: () => void;
  onOpen: () => void;
}> = ({ open, onClose, onOpen }) => {
  const { t } = useTranslation();
  const nav = useNavigate();
  const theme = useTheme();
  const { enqueueSnackbar } = useSnackbar();

  const [_, { importBook }] = useImportBook();

  const matchUpSm = useMediaQuery(theme.breakpoints.up('sm'));

  const animaProps: Pick<GrowProps, 'in' | 'timeout' | 'style'> = useMemo(
    () => ({
      in: matchUpSm ? matchUpSm && open : true,
      timeout: 500,
      style: { transformOrigin: '0 50%' },
    }),
    [matchUpSm, open],
  );
  const loc = useLocation();

  const closeIfXs = () => {
    if (!matchUpSm) onClose();
  };
  useEffect(() => {
    closeIfXs();
  }, [loc]);

  const CommonLink = (to: To, title: string, icon: ReactNode) => (
    <RouterLink to={to}>
      {({ isActive }) => (
        <StyledMuiListItemButton selected={isActive}>
          <ListItemIcon>{icon}</ListItemIcon>
          <ListItemText primary={title} />
        </StyledMuiListItemButton>
      )}
    </RouterLink>
  );

  const Content = (
    <List
      component="aside"
      sx={{ height: 1, display: 'flex', flexDirection: 'column' }}>
      {/* 导入 */}
      <ListItem sx={{ pb: 2 }}>
        <Button
          fullWidth
          type="button"
          variant="contained"
          size="large"
          onClick={async () => {
            closeIfXs();
            const res = await importBook();
            if (!res) return;
            if (res.res) {
              nav(ROUTE_PATH.ROOT);
              enqueueSnackbar({
                variant: 'success',
                message: t('actionRes.import book success'),
              });
            }
            if (!res.res)
              enqueueSnackbar({
                variant: res.msg ? 'warning' : 'error',
                message: res.msg || t('actionRes.import book fail'),
              });
          }}>
          {t('import ebook')}
        </Button>
      </ListItem>

      {/* 全部图书 */}
      <Grow {...animaProps}>
        {CommonLink(ROUTE_PATH.ROOT, t('all'), <MenuBookRounded />)}
      </Grow>

      {/* 文件夹 */}
      <Grow {...animaProps}>
        {CommonLink(`${ROUTE_PATH.DIR}`, t('folder'), <FolderOpenRounded />)}
      </Grow>

      {/* 标签列表 */}
      <TagList sx={{ flexGrow: 1, height: 0 }} {...animaProps} />

      {/* 设置、信息等 */}
      <Footer sx={{ pb: 1, zIndex: 1 }} />
    </List>
  );

  const containerStyle = useMemo<CSSProperties | undefined>(() => {
    if (matchUpSm && !open) {
      return {
        width: 0,
        padding: 0,
        overflow: 'hidden',
      };
    }
  }, [matchUpSm, open]);

  return matchUpSm ? (
    <SideBarContainer style={containerStyle}>{Content}</SideBarContainer>
  ) : (
    <StyledMuiSwipeableDrawer
      open={open}
      onClose={onClose}
      onOpen={onOpen}
      elevation={0}
      PaperProps={{
        sx: { width: 0.65 },
      }}>
      {Content}
    </StyledMuiSwipeableDrawer>
  );
};

export default SideBar;
