import { useRedirectUrlParam } from '@/hooks/url';
import { routes } from '@/routes/routes';
import { SignIn } from '@clerk/clerk-react';
import { FunctionComponent } from 'react';

export const SignInPage: FunctionComponent = () => {
  const { redirectUrl } = useRedirectUrlParam();
  return (
    <div className="flex w-full h-screen items-center justify-center">
      <SignIn
        path={routes.signIn.path}
        routing="hash"
        signUpUrl={routes.signUp.path}
        redirectUrl={redirectUrl}
        afterSignInUrl={redirectUrl}
        afterSignUpUrl={redirectUrl}
      />
    </div>
  );
};
