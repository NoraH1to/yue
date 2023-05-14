import fs from '@/modules/fs';
import { TTagDistribution } from '@/modules/fs/Fs';
import {
  Button,
  Checkbox,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
  DialogTitle,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  TextField,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { useDebounce } from 'ahooks';
import { useLiveQuery } from 'dexie-react-hooks';
import { FC, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Dot from '../Dot';
import MuiTypography from '../Styled/MuiTypography';
import TagAddDialog from '../TagItem/TagAddDialog';

export type EditTagDialogBulkProps = {
  bookHashList: string[];
} & DialogProps;

const EditTagDialogBulk: FC<EditTagDialogBulkProps> = ({
  bookHashList,
  ...props
}) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const matchUpSm = useMediaQuery(theme.breakpoints.up('sm'));
  const originTags = useLiveQuery(
    () => fs.getTagDistributionByBookHashList(bookHashList),
    [bookHashList],
  );
  const [tags, setTags] = useState(originTags);
  useEffect(() => setTags(originTags), [originTags]);
  const [updatingMap, setUpdatingMap] = useState<Record<string, boolean>>({});
  const handleToggleTag = async (
    value: boolean,
    tag: TTagDistribution,
    tags: TTagDistribution[],
    bookHashList: string[],
  ) => {
    setUpdatingMap((updatingMap) => ({ ...updatingMap, [tag.id]: true }));
    try {
      await Promise.all(
        bookHashList.map((hash) =>
          value
            ? fs.addBookTag({ hash, tagID: tag.id })
            : fs.deleteBookTag({ hash, tagID: tag.id }),
        ),
      );
      tags[tags.indexOf(tag)] = {
        ...tag,
        distribution: tag.distribution === 'none' ? 'all' : 'none',
      };
      setTags([...tags]);
    } finally {
      setUpdatingMap((updatingMap) => ({ ...updatingMap, [tag.id]: false }));
    }
  };
  const [searchInput, setSearchInput] = useState('');
  const debounceSearchInput = useDebounce(searchInput, { wait: 250 });
  const [openAddTagDialog, setOpenAddTagDialog] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const getDisplay = (tag: TTagDistribution) =>
    debounceSearchInput
      ? tag.title.includes(debounceSearchInput)
        ? undefined
        : 'none'
      : undefined;
  return (
    <>
      <Dialog
        {...props}
        fullScreen={!matchUpSm}
        sx={{ minWidth: '200px' }}
        PaperProps={{ sx: { minHeight: '300px' } }}
        maxWidth="md">
        <DialogTitle>
          {t('action.bulk edit book tag')}
          <TextField
            sx={{ mt: 2 }}
            fullWidth
            variant="outlined"
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder={t('tag')!}
            InputProps={{
              endAdornment: (
                <Button onClick={() => setOpenAddTagDialog(true)}>
                  {t('action.create')}
                </Button>
              ),
            }}
            inputRef={inputRef}
          />
        </DialogTitle>
        <DialogContent sx={{ pb: 0 }}>
          {tags?.map((tag) => (
            <ListItem
              key={tag.id}
              sx={{ userSelect: 'none', display: getDisplay(tag) }}
              secondaryAction={
                <ListItemSecondaryAction>
                  <Dot color={tag.color} size={theme.spacing(1)} />
                </ListItemSecondaryAction>
              }>
              <ListItemIcon>
                {updatingMap[tag.id] ? (
                  <CircularProgress size="42px" />
                ) : (
                  <Checkbox
                    onChange={(e, value) =>
                      handleToggleTag(value, tag, tags, bookHashList)
                    }
                    checked={tag.distribution !== 'none'}
                    indeterminate={tag.distribution === 'partial'}
                  />
                )}
              </ListItemIcon>
              <ListItemText
                primary={
                  <MuiTypography mr={1} lineClampCount={1}>
                    {tag.title}
                  </MuiTypography>
                }
              />
            </ListItem>
          ))}
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

export default EditTagDialogBulk;
