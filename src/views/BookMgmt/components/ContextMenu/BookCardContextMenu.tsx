import BookItemContextMenu, { BookItemContextMenuProps } from '@/components/BookItem/ContextMenu';
import useMgmtBook from '@/hooks/useMgmtBook';
import { TFsBookWithoutContent } from '@/modules/fs/Fs';
import { FC, memo } from 'react';

export type BookCardContextMenuProps = Omit<BookItemContextMenuProps, 'onMultiSelect'> & {
  book: TFsBookWithoutContent;
  onMultiSelect?: (book: TFsBookWithoutContent) => void;
};

const BookCardContextMenu: FC<BookCardContextMenuProps> = ({
  book,
  onDelete,
  onEditTag,
  onMultiSelect,
  ...props
}) => {
  const [, { deleteBook }] = useMgmtBook();

  return (
    <>
      <BookItemContextMenu
        {...props}
        onDelete={() => {
          onDelete?.();
          book && deleteBook(book.hash);
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
