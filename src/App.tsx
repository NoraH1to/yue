import { LoadingProvide } from '@/hooks/useLoading';
import { CloseRounded } from '@mui/icons-material';
import {
  Box,
  Button,
  CssBaseline,
  IconButton,
  Snackbar,
  styled,
} from '@mui/material';
import {
  Experimental_CssVarsProvider as CssVarsProvider,
  experimental_extendTheme as extendTheme,
  useColorScheme,
} from '@mui/material/styles';
import { ConfirmProvider } from 'material-ui-confirm';
import { SnackbarProvider } from 'notistack';
import { FC, PropsWithChildren, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Outlet } from 'react-router-dom';
import { useRegisterSW } from 'virtual:pwa-register/react';
import useSetting, { SettingProvide } from './hooks/useSetting';
import themeMap from './themes';

const Updater = () => {
  const { t } = useTranslation();
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW();
  return (
    <Snackbar
      open={needRefresh}
      message={t('app can update')}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      action={
        <>
          <Button onClick={() => updateServiceWorker(true)}>
            {t('action.refresh')}
          </Button>
          <IconButton onClick={() => setNeedRefresh(false)}>
            <CloseRounded />
          </IconButton>
        </>
      }
    />
  );
};

const AppContainer = styled(Box, { label: 'app-container' })(({ theme }) => ({
  display: 'flex',
  height: '100%',
  flexFlow: 'row',
  backgroundColor: theme.palette.background.default,
}));

const ThemeProvide: FC<PropsWithChildren> = ({ children }) => {
  const [theme, setTheme] = useState(themeMap.default);
  const curTheme = useMemo(
    () =>
      extendTheme({
        colorSchemes: theme.mui,
        typography: {
          fontFamily: [
            // apple
            '-apple-system',
            // linux
            'BlinkMacSystemFont',
            // md
            'Roboto',
            // special
            'Helvetica Neue',
            'PingFang SC',
            // fallback
            'Tahoma',
            'Arial',
            'sans-serif',
            // emoji
            '"Apple Color Emoji"',
            '"Segoe UI Emoji"',
            '"Segoe UI Symbol"',
          ].join(','),
        },
      }),
    [theme],
  );
  const [setting] = useSetting();
  return (
    <CssVarsProvider theme={curTheme} defaultMode={setting.colorMode}>
      <CssBaseline enableColorScheme />
      {children}
    </CssVarsProvider>
  );
};

const AppContent: FC = () => {
  const { t } = useTranslation();
  const [setting] = useSetting();
  const { setMode } = useColorScheme();
  useEffect(() => {
    setMode(setting.colorMode);
  }, [setting.colorMode]);
  return (
    <LoadingProvide>
      <ConfirmProvider
        defaultOptions={{
          title: t('are you sure?'),
          confirmationText: t('action.confirm'),
          cancellationText: t('action.cancel'),
        }}>
        <SnackbarProvider
          maxSnack={4}
          autoHideDuration={2000}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}>
          <AppContainer>
            <Outlet />
            <Updater />
          </AppContainer>
        </SnackbarProvider>
      </ConfirmProvider>
    </LoadingProvide>
  );
};

function App() {
  return (
    <SettingProvide>
      <ThemeProvide>
        <AppContent />
      </ThemeProvide>
    </SettingProvide>
  );
}

export default App;
