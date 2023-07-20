import { useTranslation } from 'react-i18next';
import StatusWrapper from '../StatusWrapper';
import StatusActionGoHomeOrBack from '../StatusWrapper/StatusActionGoHomeOrBack';
import StatusTypography from '../StatusWrapper/StatusTypography';

const StatusUnExistPage = () => {
  const { t } = useTranslation();
  return (
    <StatusWrapper>
      <StatusTypography variant="h2" fontWeight={500}>
        404
      </StatusTypography>
      <StatusTypography>{t('page not found')}</StatusTypography>
      <StatusActionGoHomeOrBack />
    </StatusWrapper>
  );
};

export default StatusUnExistPage;
