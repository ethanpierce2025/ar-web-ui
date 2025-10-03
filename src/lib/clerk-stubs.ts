export const useUser = () => ({
  isSignedIn: false,
  user: null as any,
  isLoaded: true,
});

export const useClerk = () => ({
  setActive: () => Promise.resolve(),
  signOut: () => Promise.resolve(),
  openSignIn: () => {},
  openSignUp: () => {},
  openUserProfile: () => {},
  openOrganizationProfile: () => {},
});

export const useSession = () => ({
  isSignedIn: false,
  session: null,
  isLoaded: true,
});

export const useAuth = () => ({
  getToken: async () => null,
  isSignedIn: false,
  isLoaded: true,
  userId: null,
  sessionId: null,
  orgId: null,
  orgRole: null,
  orgSlug: null,
  signOut: () => Promise.resolve(),
});

export const SignIn = () => null;
export const SignUp = () => null;
export const UserButton = () => null;
export const OrganizationSwitcher = () => null;
export const SignedIn = ({ children }: { children: React.ReactNode }) => null;
export const SignedOut = ({ children }: { children: React.ReactNode }) => null;
