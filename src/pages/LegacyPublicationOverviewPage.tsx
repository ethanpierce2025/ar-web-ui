import { defaultPublicationVersion } from '@/constants';
import { useLegacyPublicationOverviewUrlParams } from '@/hooks/url';
import { routes } from '@/routes/routes';
import { replaceUrlParams } from '@/utils/api-client';
import { FunctionComponent } from 'react';
import { Navigate } from 'react-router-dom';

export const LegacyPublicationOverviewPage: FunctionComponent = () => {
  const { publicationSlug } = useLegacyPublicationOverviewUrlParams();

  return (
    <Navigate
      to={replaceUrlParams({
        path: routes.publication.path,
        pathParams: { publicationSlug, publicationVersion: defaultPublicationVersion },
      })}
      replace
    />
  );
};
