import { useEffect } from 'react';

export function useScrollToTop(dependencies: any[] = []) {
  useEffect(() => {
    window.scrollTo({ behavior: 'smooth', left: 0, top: 0 });
  }, dependencies);
}
