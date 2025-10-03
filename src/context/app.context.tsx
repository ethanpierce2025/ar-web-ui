import { useTrackSigIn } from '@/hooks/events';
import { useGetCurrentUser } from '@/queries/users.query';
import { useGetVisitor } from '@/queries/visitors.query';
import { UrlKey } from '@/routes/routes';
import { User } from '@/types/user.type';
import { BrowserStorage } from '@/utils/storage';
import { useClerk, useUser } from '@clerk/clerk-react';
import { freeTrialOrganizationSlug } from '@shared/constants';
import posthog from 'posthog-js';
import { FunctionComponent, PropsWithChildren, createContext, useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export type AppContext = {
  groupCode?: string;
  removeGroupCode: () => void;
  setGroupCode: (code: string | undefined) => void;
  user?: User;
};

export const AppContext = createContext<null | AppContext>(null);

export const AppProvider: FunctionComponent<PropsWithChildren> = (props) => {
  const { children } = props;
  useTrackSigIn();
  const { data: user } = useGetCurrentUser();
  const { data: visitor } = useGetVisitor();
  const { user: clerkUser } = useUser();
  const { setActive } = useClerk();
  const navigate = useNavigate();
  const location = useLocation();
  const distinctId = BrowserStorage.getOrGenerateClientId();

  const search = new URLSearchParams(location.search);
  const groupCodeParam = search.get(UrlKey.GROUP_CODE) ?? undefined;

  const [groupCode, setGroupCode] = useState<string | undefined>(BrowserStorage.getGroupCode);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (!visitor && !user) {
      BrowserStorage.setFeatures({ features: [] });
    } else if (user) {
      removeGroupCode();
      posthog.identify(distinctId, {
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      });
      BrowserStorage.setFeatures({ features: user.features });
    } else if (visitor) {
      BrowserStorage.setFeatures({ features: visitor.features });
    }
  }, [visitor, user]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (groupCodeParam) {
      updateGroupCode(groupCodeParam);
      navigate(location.pathname);
    }
  }, [groupCodeParam]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: only run on initial load of user
  useEffect(() => {
    if (clerkUser?.organizationMemberships.length) {
      const nonFreeTrialOrganization = clerkUser.organizationMemberships.find(
        (membership) => membership.organization.slug !== freeTrialOrganizationSlug,
      );
      const arFreeTrialOrganization = clerkUser.organizationMemberships.find(
        (membership) => membership.organization.slug === freeTrialOrganizationSlug,
      );
      if (nonFreeTrialOrganization) {
        setActive({ organization: nonFreeTrialOrganization.organization.id });
      } else if (arFreeTrialOrganization) {
        setActive({ organization: arFreeTrialOrganization.organization.id });
      }
    }
  }, [user]);

  function updateGroupCode(code: string) {
    setGroupCode(code);
    BrowserStorage.setGroupCode(code);
    posthog.identify(distinctId, {
      groupCode: code,
    });
  }

  function removeGroupCode() {
    setGroupCode(undefined);
    BrowserStorage.removeGroupCode();
    posthog.identify(distinctId, {
      groupCode: null,
    });
  }

  return (
    <AppContext.Provider
      value={{
        groupCode: groupCode ?? groupCodeParam,
        removeGroupCode,
        setGroupCode: updateGroupCode,
        user,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext) as AppContext;
