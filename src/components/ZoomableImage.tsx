import React, { useEffect, useRef, useState } from 'react';

interface ZoomableImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  maxScale?: number;
  minScale?: number;
}

export const ZoomableImage: React.FC<ZoomableImageProps> = ({
  maxScale = 3,
  minScale = 1,
  className = '',
  ...imgProps
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const pointers = useRef<Map<number, PointerEvent>>(new Map());

  const getDistance = (a: PointerEvent, b: PointerEvent) => {
    const dx = a.clientX - b.clientX;
    const dy = a.clientY - b.clientY;
    return Math.hypot(dx, dy);
  };

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onPointerDown = (e: PointerEvent) => {
      (e.target as Element).setPointerCapture?.(e.pointerId);
      pointers.current.set(e.pointerId, e);
    };

    let initialDistance = 0;
    let startOffset = { x: 0, y: 0 };
    let startScale = 1;

    const onPointerMove = (e: PointerEvent) => {
      const map = pointers.current;
      if (!map.has(e.pointerId)) return;
      map.set(e.pointerId, e);

      if (map.size === 2) {
        const [a, b] = Array.from(map.values());
        const dist = getDistance(a, b);
        if (!initialDistance) {
          initialDistance = dist;
          startScale = scale;
        } else {
          const ratio = dist / initialDistance;
          const newScale = Math.min(maxScale, Math.max(minScale, startScale * ratio));
          setScale(newScale);
        }
      } else if (map.size === 1 && scale > 1) {
        const p = Array.from(map.values())[0];
        if (startOffset.x === 0 && startOffset.y === 0) {
          startOffset = { ...offset };
        } else {
          const dx = e.movementX;
          const dy = e.movementY;
          setOffset({ x: startOffset.x + dx, y: startOffset.y + dy });
        }
      }
    };

    const onPointerUp = (e: PointerEvent) => {
      pointers.current.delete(e.pointerId);
      if (pointers.current.size < 2) {
        initialDistance = 0;
      }
      if (pointers.current.size === 0) {
        startOffset = { x: 0, y: 0 };
      }
    };

    el.addEventListener('pointerdown', onPointerDown);
    el.addEventListener('pointermove', onPointerMove);
    el.addEventListener('pointerup', onPointerUp);
    el.addEventListener('pointercancel', onPointerUp);
    el.addEventListener('pointerleave', onPointerUp);

    return () => {
      el.removeEventListener('pointerdown', onPointerDown);
      el.removeEventListener('pointermove', onPointerMove);
      el.removeEventListener('pointerup', onPointerUp);
      el.removeEventListener('pointercancel', onPointerUp);
      el.removeEventListener('pointerleave', onPointerUp);
    };
  }, [scale, maxScale, minScale, offset]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full touch-pan-y overflow-hidden bg-black/5 ${className}`}
      style={{ touchAction: 'none' }}
    >
      <img
        {...imgProps}
        className="w-full h-full object-contain select-none"
        draggable={false}
        style={{
          transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
          transformOrigin: 'center center',
          transition: 'transform 0.03s linear',
        }}
      />
    </div>
  );
};
