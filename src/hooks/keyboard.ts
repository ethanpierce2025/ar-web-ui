import { useEffect } from 'react';

export function useOnPressKey(onPressKey: (event: KeyboardEvent) => void) {
  useEffect(() => {
    window.addEventListener('keydown', onPressKey);

    return () => {
      window.removeEventListener('keydown', onPressKey);
    };
  }, [onPressKey]);
}
