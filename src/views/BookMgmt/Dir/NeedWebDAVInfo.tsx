import StatusWrapper from '@/components/StatusWrapper';
import { ROUTE_PATH } from '@/router';
import { Button, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const NeedWebDAVInfo = () => {
  const { t } = useTranslation();
  return (
    <StatusWrapper>
      <Typography variant="h5" color="text.secondary">
        {t('need webdav')}
      </Typography>
      <Link to={`/${ROUTE_PATH.SETTING}`}>
        <Button variant="outlined">{t('goto setting')}</Button>
      </Link>
    </StatusWrapper>
  );
};
export default NeedWebDAVInfo;
