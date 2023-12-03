import { ITag } from '@/modules/book/Tag';
import fs from '@/modules/fs';
import { TFsBookWithoutContent } from '@/modules/fs/Fs';
import {
  Autocomplete,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
  DialogTitle,
  ListItemButton,
  ListItemText,
  Stack,
  TextField,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { useLiveQuery } from 'dexie-react-hooks';
import { FC, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Dot from '../Dot';
import TagAddDialog from '../TagItem/TagAddDialog';

export type BookItemEditTagDialogProps = {
  book?: TFsBookWithoutContent;
} & DialogProps;

const BookItemEditTagDialog: FC<BookItemEditTagDialogProps> = ({ book, ...props }) => {
  const { t } = useTranslation();
  const tags = useLiveQuery(() => fs.getTags());
  const booksTag = useLiveQuery(() => book && fs.getTagsByBookHash(book.hash), [book?.hash]);
  const booksTagMap = useMemo(() => {
    const map: Record<ITag['id'], ITag> = {};
    booksTag?.forEach((tag) => {
      map[tag.id] = tag;
    });
    return map;
  }, [booksTag]);

  const [openAddTagDialog, setOpenAddTagDialog] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const theme = useTheme();
  const matchUpXs = useMediaQuery(theme.breakpoints.up('sm'));

  return (
    <>
      <Dialog
        {...props}
        fullScreen={!matchUpXs}
        PaperProps={{
          ...props.PaperProps,
          sx: [
            matchUpXs
              ? {
                  height: 0.5,
                  minWidth: '240px',
                  width: '65vw',
                  maxWidth: '800px',
                }
              : {},
            ...(Array.isArray(props.PaperProps?.sx)
              ? props.PaperProps!.sx
              : [props.PaperProps?.sx]),
          ],
        }}>
        <DialogTitle>{t('tag')}</DialogTitle>
        <DialogContent>
          <Stack gap={2} sx={{ height: 1 }}>
            <Autocomplete
              clearOnBlur={false}
              forcePopupIcon={false}
              options={tags || []}
              loading={!tags}
              noOptionsText={t('bookEditTag.no tag by search')}
              getOptionLabel={(tag) => tag.title}
              isOptionEqualToValue={(o, v) => o.id === v.id}
              filterOptions={(tags, state) =>
                tags.filter(
                  (tag) =>
                    !booksTagMap[tag.id] &&
                    (state.inputValue ? tag.title.includes(state.inputValue) : true),
                )
              }
              /**
               * forcePopupIcon 为 false 时，如果 input 内有值
               * 右内边距会跟 forcePopupIcon 为 true 时一致（太宽了）
               * 估计是个 bug
               */
              sx={{
                '& .MuiInputBase-root.MuiInputBase-root': {
                  paddingRight: '9px',
                },
              }}
              onChange={(e, v) => {
                if ((v && booksTagMap[v?.id]) || !v || !book) return;
                fs.addBookTag({
                  hash: book.hash,
                  tagID: v.id,
                });
              }}
              renderOption={(props, option, state) => (
                // @ts-ignore
                <ListItemButton key={option.id} selected={state.selected} {...props}>
                  <Dot color={option.color} size={theme.spacing(1)} />
                  <Box mr={2} />
                  <ListItemText primary={option.title} />
                </ListItemButton>
              )}
              renderInput={(p) => (
                <TextField
                  {...p}
                  InputProps={{
                    ...p.InputProps,
                    endAdornment: (
                      <Button onClick={() => setOpenAddTagDialog(true)}>
                        {t('action.create')}
                      </Button>
                    ),
                  }}
                  placeholder={t('search tag')!}
                  variant="outlined"
                  inputRef={inputRef}
                />
              )}
            />
            <Box flexGrow={1} height={0} overflow="auto">
              <Stack direction="row" flexWrap="wrap" gap={1}>
                {booksTag?.map((tag) => (
                  <Chip
                    key={tag.id}
                    label={tag.title}
                    sx={{ background: tag.color }}
                    onDelete={() => {
                      if (!book) return;
                      fs.deleteBookTag({ hash: book.hash, tagID: tag.id });
                    }}
                  />
                ))}
              </Stack>
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => props.onClose?.({}, 'escapeKeyDown')}>
            {t('action.confirm')}
          </Button>
        </DialogActions>
      </Dialog>
      <TagAddDialog
        open={openAddTagDialog}
        onClose={() => setOpenAddTagDialog(false)}
        initValue={{ title: inputRef.current?.value || '' }}
      />
    </>
  );
};
export default BookItemEditTagDialog;
