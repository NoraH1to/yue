import BookItemContextMenu, {
  BookItemContextMenuProps,
} from '@/components/BookItem/ContextMenu';
import fs from '@/modules/fs';
import { TFsBook } from '@/modules/fs/Fs';
import { useConfirm } from 'material-ui-confirm';
import { useSnackbar } from 'notistack';
import { FC, memo } from 'react';
import { useTranslation } from 'react-i18next';

export type BookCardContextMenuProps = Omit<
  BookItemContextMenuProps,
  'onMultiSelect'
> & {
  book: TFsBook;
  onMultiSelect?: (book: TFsBook) => void;
};

const BookCardContextMenu: FC<BookCardContextMenuProps> = ({
  book,
  onDelete,
  onEditTag,
  onMultiSelect,
  ...props
}) => {
  const { t } = useTranslation();
  const confirm = useConfirm();
  const { enqueueSnackbar } = useSnackbar();

  return (
    <>
      <BookItemContextMenu
        {...props}
        onDelete={() => {
          onDelete?.();
          confirm()
            .then(() => book && fs.deleteBook(book.hash))
            .then(() =>
              enqueueSnackbar({
                variant: 'success',
                message: t('actionRes.delete book success'),
              }),
            );
        }}
        onEditTag={() => {
          onEditTag?.();
        }}
        onMultiSelect={() => {
          onMultiSelect?.(book);
        }}
      />
    </>
  );
};

export const MemoBookCardContextMenu = memo(BookCardContextMenu);

export default BookCardContextMenu;
