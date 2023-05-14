import BookItemBaseCard from '@/components/BookItem/BaseCard';
import { MemoBookItemSelectedBackdrop } from '@/components/BookItem/SelectedBackdrop';
import ContextMenuTrigger, {
  ContextMenuTriggerProps,
} from '@/components/ContextMenu/Trigger';
import { TFsBook } from '@/modules/fs/Fs';
import { FC, memo, useCallback, useMemo, useState } from 'react';
import { MemoBookCardContextMenu } from '../components/ContextMenu/BookCardContextMenu';

type BookCardProps = {
  book: TFsBook;
  selected: boolean;
  onSelect?: (book: TFsBook) => void;
  onClick?: (book: TFsBook) => void;
  onEditTag?: (book: TFsBook) => void;
};

const BookCard: FC<BookCardProps> = ({
  book,
  selected,
  onSelect,
  onClick,
  onEditTag,
}) => {
  const [menuState, setMenuState] = useState({ open: false, x: 0, y: 0 });
  const handleMenuOpen = useCallback<
    NonNullable<ContextMenuTriggerProps['onOpen']>
  >(
    (position) => {
      setMenuState({ ...position, open: true });
    },
    [setMenuState],
  );
  const handleMenuClose = useCallback(
    () => setMenuState((menuState) => ({ ...menuState, open: false })),
    [],
  );
  const handleMenuEditTag = useCallback(
    () => onEditTag?.(book),
    [onEditTag, book?.hash],
  );
  const handleClick = useCallback(() => onClick?.(book), [book?.hash, onClick]);
  const cover = useMemo(
    () => book?.cover && window.URL.createObjectURL(book.cover),
    [book?.cover],
  );
  return (
    <>
      <ContextMenuTrigger onOpen={handleMenuOpen}>
        {({ triggerProps }) => (
          <BookItemBaseCard
            {...triggerProps}
            ext={book.type}
            loaded={!!book}
            title={book.title}
            image={cover}
            scaleOnHover={!selected}
            onClick={handleClick}
          />
        )}
      </ContextMenuTrigger>
      <MemoBookItemSelectedBackdrop
        show={selected}
        position="absolute"
        onClick={handleClick}
      />
      <MemoBookCardContextMenu
        book={book}
        {...menuState}
        onClose={handleMenuClose}
        onMultiSelect={onSelect}
        onEditTag={handleMenuEditTag}
      />
    </>
  );
};

export default memo(BookCard);
