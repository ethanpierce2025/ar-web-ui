import '@/styles/main.css';
import '@/styles/theme.css';
import { ClerkProvider } from '@clerk/clerk-react';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { SnackbarProvider } from 'notistack';
import 'react-tooltip/dist/react-tooltip.css';
import { RoleSelectionModal } from './components/RoleSelectionModal';
import { initEditionIndicator } from './components/reader/LevelsDropdown';
import { config } from './config';
import { queryClient } from './queries/client';
import { AppRouter } from './routes/router';
import { theme } from './styles/theme';
import { initGoogleAnalytics } from './utils/ga';
import { initPostHog } from './utils/posthog';

initPostHog();
initGoogleAnalytics();
initEditionIndicator();

export const App: React.FC = () => {
  return (
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: theme.primaryColor,
        },
      }}
      publishableKey={config.app.clerkClientKey}
    >
      <QueryClientProvider client={queryClient}>
        <SnackbarProvider>
          <AppRouter />
          <RoleSelectionModal />
        </SnackbarProvider>
        <ReactQueryDevtools
          buttonPosition="top-left"
          initialIsOpen={false}
        />
      </QueryClientProvider>
    </ClerkProvider>
  );
};
