import { isRouteErrorResponse, useRouteError } from 'react-router-dom';
import StatusWrapper from '../StatusWrapper';
import StatusActionGoHomeOrBack from '../StatusWrapper/StatusActionGoHomeOrBack';
import StatusTypography from '../StatusWrapper/StatusTypography';
import { useTranslation } from 'react-i18next';

const StatusUnCatchError = () => {
  const { t } = useTranslation();
  const error = useRouteError();
  const msg =
    error instanceof Error
      ? error.message
      : isRouteErrorResponse(error)
      ? error.error?.message
      : t('unknown error');
  const code = isRouteErrorResponse(error) ? error.status : 'OOPS!';
  return (
    <StatusWrapper>
      <StatusTypography variant="h2" fontWeight={500}>
        {code}
      </StatusTypography>
      <StatusTypography>{msg}</StatusTypography>
      <StatusActionGoHomeOrBack />
    </StatusWrapper>
  );
};

export default StatusUnCatchError;
