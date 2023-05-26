import { getRandomColor } from '@/helper';
import { ITag } from '@/modules/book/Tag';
import fs from '@/modules/fs';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
  DialogTitle,
  Stack,
} from '@mui/material';
import { Form, Formik } from 'formik';
import { nanoid } from 'nanoid';
import { useSnackbar } from 'notistack';
import { useTranslation } from 'react-i18next';
import { Optional } from 'utility-types';
import * as Yup from 'yup';
import FormTag, { YupSchema } from '../Form/Tag';

const TagAddDialog = ({
  initValue,
  ...props
}: DialogProps & { initValue?: Partial<ITag> }) => {
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  return (
    <Dialog {...props}>
      <Formik
        validateOnChange={false}
        validationSchema={Yup.object<ITag>({
          ...YupSchema,
          title: YupSchema.title.test(
            'is exist',
            t('formHelper.already exist tag') as string,
            async (v) => !(await fs.getTagByTitle(v!)),
          ),
        })}
        initialValues={Object.assign(
          {
            title: '',
            id: '',
            color: getRandomColor('hex') as string,
          },
          initValue || {},
        )}
        onSubmit={async (values: Optional<ITag, 'id'>) => {
          try {
            await fs.addTag({ ...values, id: nanoid() });
          } catch (e) {
            console.error((e as Error).stack);
            enqueueSnackbar({
              variant: 'error',
              message: t('action.create tag fail'),
            });
          } finally {
            props.onClose?.({}, 'escapeKeyDown');
          }
        }}>
        <Form>
          <DialogTitle>{t('action.create tag')}</DialogTitle>
          <DialogContent>
            <Box pt={2}>
              <Stack direction="column" gap={2}>
                <FormTag />
              </Stack>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button type="submit">{t('action.save')}</Button>
          </DialogActions>
        </Form>
      </Formik>
    </Dialog>
  );
};
export default TagAddDialog;
