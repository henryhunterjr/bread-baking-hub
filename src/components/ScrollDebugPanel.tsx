
import { useEffect, useState } from 'react';

export const ScrollDebugPanel = ({ isOpen }: { isOpen: boolean }) => {
  const [bodyStyles, setBodyStyles] = useState<any>({});
  const [scrollInfo, setScrollInfo] = useState<any>({});

  useEffect(() => {
    const updateDebugInfo = () => {
      setBodyStyles({
        overflow: document.body.style.overflow,
        position: document.body.style.position,
        top: document.body.style.top,
        width: document.body.style.width,
        className: document.body.className,
      });
      
      setScrollInfo({
        scrollY: window.scrollY,
        scrollHeight: document.body.scrollHeight,
        innerHeight: window.innerHeight,
        canScroll: document.body.scrollHeight > window.innerHeight,
        documentScrollTop: document.documentElement.scrollTop,
      });
    };

    updateDebugInfo();
    const interval = setInterval(updateDebugInfo, 500);
    return () => clearInterval(interval);
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-black/90 text-white p-4 rounded-lg text-xs max-w-sm z-[9999] font-mono">
      <div className="font-bold mb-2">🐛 Scroll Debug Panel</div>
      
      <div className="mb-2">
        <div className="font-semibold">Body Styles:</div>
        <div>overflow: "{bodyStyles.overflow}"</div>
        <div>position: "{bodyStyles.position}"</div>
        <div>top: "{bodyStyles.top}"</div>
        <div>width: "{bodyStyles.width}"</div>
        <div>classes: "{bodyStyles.className}"</div>
      </div>
      
      <div>
        <div className="font-semibold">Scroll Info:</div>
        <div>scrollY: {scrollInfo.scrollY}</div>
        <div>scrollHeight: {scrollInfo.scrollHeight}</div>
        <div>innerHeight: {scrollInfo.innerHeight}</div>
        <div>canScroll: {scrollInfo.canScroll ? '✅' : '❌'}</div>
        <div>docScrollTop: {scrollInfo.documentScrollTop}</div>
      </div>
    </div>
  );
};
