import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';

import MuiColorInput from '@/components/Formik/MuiColorInput';
import MuiTextFiled from '@/components/Formik/MuiTextFiled';
import { isValidColor } from '@/helper';
import i18n from '@/i18n';

const { t } = i18n;

const FormTag = () => {
  const { t } = useTranslation();
  return (
    <>
      <MuiTextFiled name="id" sx={{ display: 'none' }} />
      <MuiTextFiled name="title" label={t('tagInfo.title')} />
      <MuiColorInput name="color" label={t('tagInfo.color')} />
    </>
  );
};

export const YupSchema = {
  title: Yup.string().required(t('formHelper.required') as string),
  color: Yup.string()
    .notRequired()
    .test('Legal color values', t('formHelper.incorrect color value') as string, (v) =>
      !v ? true : isValidColor(v),
    ),
};

export default FormTag;
