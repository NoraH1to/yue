import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';

import MuiTextFiled from '@/components/Formik/MuiTextFiled';
import i18n from '@/i18n';

const { t } = i18n;

const WebDAV = () => {
  const { t } = useTranslation();
  return (
    <>
      <MuiTextFiled name="url" label={t('webDAVInfo.url')} />
      <MuiTextFiled name="dirBasePath" label={t('webDAVInfo.customDirBasePath')} />
      <MuiTextFiled name="username" label={t('webDAVInfo.username')} />
      <MuiTextFiled name="password" label={t('webDAVInfo.password')} />
    </>
  );
};

export const YupSchema = {
  url: Yup.string()
    .when(['username', 'password'], ([username, password], schema) =>
      username || password
        ? schema.required(t('formHelper.required') as string)
        : schema.notRequired(),
    )
    .test('Legal url', t('formHelper.incorrect url') as string, (v) => {
      try {
        v && new URL(v);
        return true;
      } catch {
        return false;
      }
    }),
  dirBasePath: Yup.string().notRequired(),
  username: Yup.string().notRequired(),
  password: Yup.string().notRequired(),
};

export default WebDAV;
