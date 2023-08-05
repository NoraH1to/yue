import { SnackbarProvider } from 'notistack';
import { Outlet } from 'react-router-dom';

const AppView = () => (
  <SnackbarProvider
    maxSnack={4}
    autoHideDuration={2000}
    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}>
    <Outlet />
  </SnackbarProvider>
);

export default AppView;
