import { useMediaQuery } from 'react-responsive';
import resolveConfig from 'tailwindcss/resolveConfig';
import tailwindConfig from '../../tailwind.config';

const twConfig = resolveConfig(tailwindConfig);
type BreakpointKey = keyof typeof twConfig.theme.screens;

export function useBreakpoints(breakpoint: BreakpointKey) {
  return useMediaQuery({
    query: `(min-width: ${twConfig.theme.screens[breakpoint]})`,
  });
}
