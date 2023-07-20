import StatusTypography from '@/components/StatusWrapper/StatusTypography';
import { ROUTE_PATH } from '@/router';
import { Button } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const StatusActionGoHomeOrBack = () => {
  const { t } = useTranslation();
  const nav = useNavigate();
  return (
    <StatusTypography>
      <Button onClick={() => nav(-1)}>{t('go back')}</Button>
      <Button onClick={() => nav(ROUTE_PATH.ROOT)}>{t('go home')}</Button>
    </StatusTypography>
  );
};

export default StatusActionGoHomeOrBack;
