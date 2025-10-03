import { useEffect } from 'react';

export function useBeforeUnload(onBeforeUnload: (event: BeforeUnloadEvent) => void) {
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    window.addEventListener('beforeunload', onBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', onBeforeUnload);
    };
  }, []);
}
