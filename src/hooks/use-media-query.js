import { useEffect, useState } from 'react';

export const screens = {
  tablet: '(max-width:768px)',
  mobile: '(max-width: 600px)',
};

export const useMediaQuery = (screen) => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(screen);

    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    const listener = () => setMatches(media.matches);

    window.addEventListener('resize', listener);

    return () => window.removeEventListener('resize', listener);
  }, [matches, screen]);

  return matches;
};
