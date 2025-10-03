import { defaultPublicationVersion } from '@/constants';
import { usePublicationWithoutVersionUrlParams } from '@/hooks/url';
import { routes } from '@/routes/routes';
import { replaceUrlParams } from '@/utils/api-client';
import { FunctionComponent } from 'react';
import { Navigate } from 'react-router-dom';

export const PublicationWithoutVersionPage: FunctionComponent = () => {
  const { publicationSlug } = usePublicationWithoutVersionUrlParams();

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
