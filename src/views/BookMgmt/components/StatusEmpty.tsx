import StatusWrapper from '@/components/StatusWrapper';
import { Fade, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

const StatusEmpty = () => {
  const { t } = useTranslation();
  return (
    <Fade in>
      <StatusWrapper>
        <Typography variant="h5" color="text.secondary">
          {t('nothing here')}
        </Typography>
      </StatusWrapper>
    </Fade>
  );
};

export default StatusEmpty;
