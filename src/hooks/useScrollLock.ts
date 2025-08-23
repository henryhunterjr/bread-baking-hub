
import { useEffect } from 'react';
import scrollLock from '@/utils/scrollLockManager';

export function useScrollLock(locked: boolean, id = 'unknown') {
  useEffect(() => {
    if (locked) scrollLock.lock(id);
    else scrollLock.unlock(id);
    return () => { if (locked) scrollLock.unlock(`${id}:unmount`); };
  }, [locked, id]);
}
