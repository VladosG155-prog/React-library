import { useState } from 'react';

export const useTimer = (duration = 2000) => {
  const [active, setActive] = useState(false);

  const activate = () => {
    setActive(true);

    setTimeout(() => {
      setActive(false);
    }, duration);
  };

  return [active, activate];
};
