import { BrowserStorage } from '@/utils/storage';
import { useUser } from '@clerk/clerk-react';
import posthog from 'posthog-js';
import { useEffect } from 'react';

export function useIdentifyUserPosthog() {
  const { user } = useUser();
  useEffect(() => {
    if (user) {
      const distinctId = BrowserStorage.getOrGenerateClientId();
      posthog.identify(distinctId, {
        email: user.emailAddresses.at(0)?.emailAddress,
        firstName: user.firstName,
        lastName: user.lastName,
      });
    }
  }, [user]);
}
