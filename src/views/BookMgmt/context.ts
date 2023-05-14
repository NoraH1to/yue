import { createContext } from 'react';

export const BookMgmtContext = createContext({
  openSidebar: true,
  toggleOpenSidebar: (open?: boolean) => {
    /* empty */
  },
});

export const BookMgmtProvider = BookMgmtContext.Provider;
