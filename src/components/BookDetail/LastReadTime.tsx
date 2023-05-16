import { diffDates } from '@/helper';
import { FC, memo } from 'react';
import { useTranslation } from 'react-i18next';
import BookDetailInfoItemText from './InfoItemText';

export type BookDetailLastReadTimeProps = { ts: number };

const BookDetailLastReadTime: FC<BookDetailLastReadTimeProps> = ({ ts }) => {
  const { t } = useTranslation();
  const diffDate = ts && diffDates(new Date(), new Date(ts));
  const lastReadDate =
    ts && diffDate
      ? diffDate.days
        ? t('diffDate.any days ago', { days: diffDate.days })
        : diffDate.hours
        ? t('diffDate.any hours ago', { hours: diffDate.hours })
        : diffDate.minutes
        ? t('diffDate.any minutes ago', { minutes: diffDate.minutes })
        : t('diffDate.just now')
      : null;
  return <BookDetailInfoItemText>{lastReadDate}</BookDetailInfoItemText>;
};

export const MemoBookDetailLastReadTime = memo(BookDetailLastReadTime);

export default BookDetailLastReadTime;
