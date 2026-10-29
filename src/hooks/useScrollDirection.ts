import { useEffect, useRef, useState } from 'react';

export function useScrollDirection(threshold = 10) {
  const [direction, setDirection] = useState<'up' | 'down'>('up');
  const [atTop, setAtTop] = useState(true);
  const lastY = useRef(0);
  const ticking = useRef(false);

  useEffect(() => {
    lastY.current = window.scrollY;
    setAtTop(window.scrollY < 10);
    let frameId: number | null = null;

    const update = () => {
      const currentY = window.scrollY;
      setAtTop(currentY < 10);
      if (Math.abs(currentY - lastY.current) > threshold) {
        setDirection(currentY > lastY.current ? 'down' : 'up');
        lastY.current = currentY;
      }
      ticking.current = false;
      frameId = null;
    };

    const onScroll = () => {
      if (!ticking.current) {
        ticking.current = true;
        frameId = window.requestAnimationFrame(update);
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (frameId !== null) window.cancelAnimationFrame(frameId);
      ticking.current = false;
    };
  }, [threshold]);

  return { direction, atTop };
}
