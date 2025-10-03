import { useRedirectUrlParam } from '@/hooks/url';
import { routes } from '@/routes/routes';
import { SignUp } from '@clerk/clerk-react';
import { FunctionComponent } from 'react';

export const SignUpPage: FunctionComponent = () => {
  const { redirectUrl } = useRedirectUrlParam();
  return (
    <div className="flex w-full h-screen items-center justify-center">
      <SignUp
        signInUrl={routes.signIn.path}
        redirectUrl={redirectUrl}
      />
    </div>
  );
};
