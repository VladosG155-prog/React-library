import { useEffect } from 'react';

export const useClickOutside = (outsideRef, callback, insideRef) => {
  useEffect(() => {
    const handleClick = (e) => {
      if (!e.composedPath().includes(outsideRef.current) && !e.composedPath().includes(insideRef.current)) {
        callback();
      }
    };

    window.addEventListener('click', handleClick);

    return () => {
      window.removeEventListener('click', handleClick);
    };
  }, [outsideRef, callback, insideRef]);
};
