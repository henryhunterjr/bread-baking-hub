// Singleton for safe body scroll locking with ref counting
type Styles = { overflow: string; paddingRight: string };

class ScrollLockManager {
  private count = 0;
  private original?: Styles;

  lock(reason = 'unknown') {
    if (this.count === 0) {
      const doc = document.documentElement;
      const body = document.body;
      const sw = window.innerWidth - doc.clientWidth;
      this.original = {
        overflow: body.style.overflow || '',
        paddingRight: body.style.paddingRight || '',
      };
      body.style.overflow = 'hidden';
      if (sw > 0) body.style.paddingRight = `${sw}px`;
    }
    this.count++;
    if (import.meta.env.DEV) console.debug('[scrollLock] lock', reason, this.count);
  }

  unlock(reason = 'unknown') {
    this.count = Math.max(0, this.count - 1);
    if (import.meta.env.DEV) console.debug('[scrollLock] unlock', reason, this.count);
    if (this.count === 0 && this.original) {
      document.body.style.overflow = this.original.overflow;
      document.body.style.paddingRight = this.original.paddingRight;
      this.original = undefined;
    }
  }

  forceReset() {
    this.count = 0;
    if (this.original) {
      document.body.style.overflow = this.original.overflow;
      document.body.style.paddingRight = this.original.paddingRight;
      this.original = undefined;
    } else {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    }
  }
}
const scrollLockManager = new ScrollLockManager();
export default scrollLockManager;