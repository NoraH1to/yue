import StatusWrapper from '@/components/StatusWrapper';
import StatusTypography from '@/components/StatusWrapper/StatusTypography';
import { ROUTE_PATH } from '@/router';
import { Button } from '@mui/material';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

export type WebDavErrorProps = {
  title: string;
};

const WebDavError: FC<WebDavErrorProps> = ({ title }) => {
  const { t } = useTranslation();
  const nav = useNavigate();
  return (
    <StatusWrapper>
      <StatusTypography variant="h5" color="text.secondary">
        {t('webDAV error msg')}
      </StatusTypography>
      <StatusTypography variant="subtitle1" color="text.secondary">
        {title}
      </StatusTypography>
      <Button variant="outlined" onClick={() => nav(`/${ROUTE_PATH.SETTING}`)}>
        {t('goto setting')}
      </Button>
    </StatusWrapper>
  );
};

export default WebDavError;
