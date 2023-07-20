import ReactDOM from 'react-dom/client';
import App from './App';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import '@/modules/fs';
import '@/parsers/register';
import './i18n';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <App />,
);
