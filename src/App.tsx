import '@/styles/main.css';
import '@/styles/theme.css';
import { QueryClientProvider } from '@tanstack/react-query';
import 'react-tooltip/dist/react-tooltip.css';
import { initEditionIndicator } from './components/reader/LevelsDropdown';
import { queryClient } from './queries/client';
import { AppRouter } from './routes/router';

initEditionIndicator();

export const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AppRouter />
    </QueryClientProvider>
  );
};
