import StatusWrapper from '@/components/StatusWrapper';
import StatusTypography from '@/components/StatusWrapper/StatusTypography';
import { Fade } from '@mui/material';
import { useTranslation } from 'react-i18next';

const StatusEmpty = () => {
  const { t } = useTranslation();
  return (
    <Fade in>
      <StatusWrapper>
        <StatusTypography>{t('nothing here')}</StatusTypography>
      </StatusWrapper>
    </Fade>
  );
};

export default StatusEmpty;
