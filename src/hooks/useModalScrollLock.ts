// Custom hook for modal scroll position management
import { useEffect, useRef } from 'react';

export const useModalScrollLock = (isOpen: boolean) => {
  const scrollPositionRef = useRef(0);

  useEffect(() => {
    if (isOpen) {
      // Save current scroll position
      scrollPositionRef.current = window.pageYOffset || document.documentElement.scrollTop;
      
      // Prevent body scroll
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollPositionRef.current}px`;
      document.body.style.width = '100%';
      document.body.style.left = '0';
      document.body.style.right = '0';
    } else if (scrollPositionRef.current !== 0) {
      // Restore body scroll
      const scrollPos = scrollPositionRef.current;
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.left = '';
      document.body.style.right = '';
      
      // Restore scroll position immediately
      requestAnimationFrame(() => {
        window.scrollTo({
          top: scrollPos,
          left: 0,
          behavior: 'instant' as ScrollBehavior,
        });
      });
    }

    return () => {
      // Cleanup on unmount
      if (document.body.style.position === 'fixed') {
        const scrollPos = scrollPositionRef.current;
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.body.style.left = '';
        document.body.style.right = '';
        window.scrollTo(0, scrollPos);
      }
    };
  }, [isOpen]);

  return scrollPositionRef;
};
