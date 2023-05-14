import StatusWrapper from '@/components/StatusWrapper';
import { ROUTE_PATH } from '@/router';
import { Button, Typography } from '@mui/material';
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
      <Typography variant="h5" color="text.secondary">
        {t('webDAV error msg')}
      </Typography>
      <Typography variant="subtitle1" color="text.secondary">
        {title}
      </Typography>
      <Button variant="outlined" onClick={() => nav(`/${ROUTE_PATH.SETTING}`)}>
        {t('goto setting')}
      </Button>
    </StatusWrapper>
  );
};

export default WebDavError;
