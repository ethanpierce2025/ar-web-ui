import { useNavigateToQrRedirect, useQrCodeParams } from '@/hooks/url';
import { useGetQrRedirectUrl } from '@/queries/qr.query';
import { FunctionComponent } from 'react';
import { NotFoundPage } from './NotFoundPage';

export const QrPage: FunctionComponent = () => {
  const { qrCode } = useQrCodeParams();

  const { data: redirectData, error: redirectError, isLoading } = useGetQrRedirectUrl({ qrCode });

  const redirect = useNavigateToQrRedirect();

  let navigateError: Error | undefined;
  if (redirectData?.url) {
    try {
      redirect(redirectData.url);
    } catch (error) {
      navigateError = error;
    }
  }

  return (
    <>
      {isLoading && <div> redirecting... </div>}
      {(redirectError || navigateError) && <NotFoundPage></NotFoundPage>}
    </>
  );
};
