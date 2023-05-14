import { useEffect, useState } from 'react';
import { isDescendant } from '@/helper';

import { MutableRefObject } from 'react';

const useEventsAway = <T extends (keyof WindowEventMap)[]>(
  listener: (this: Window, ev: WindowEventMap[T[number]]) => any,
  ref: MutableRefObject<HTMLElement | null>,
  defaultActive = true,
  events: T = ['click', 'contextmenu', 'touchmove', 'wheel'] as T,
) => {
  const [active, setActive] = useState(defaultActive);

  useEffect(() => {
    const el = ref.current;
    if (!el || !active) return;
    const _listener: typeof listener = function (e) {
      if (e.target === el || isDescendant(el, e.target as HTMLElement)) return;
      listener.call(this, e);
    };
    for (const e of events) {
      window.addEventListener(e, _listener, { capture: true });
    }
    return () => {
      if (!el) return;
      for (const e of events) {
        window.removeEventListener(e, _listener, { capture: true });
      }
    };
  }, [events, listener, active]);

  return [{ active }, { setActive }] as const;
};

export default useEventsAway;
