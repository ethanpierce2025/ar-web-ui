import { defaultPublicationVersion } from '@/constants';
import { useReadWithoutVersionUrlParams } from '@/hooks/url';
import { UrlKey, routes } from '@/routes/routes';
import { replaceUrlParams } from '@/utils/api-client';
import { FunctionComponent } from 'react';
import { Navigate } from 'react-router-dom';

export const ReadWithoutVersionPage: FunctionComponent = () => {
  const { publicationSlug } = useReadWithoutVersionUrlParams();

  return (
    <Navigate
      to={replaceUrlParams({
        path: routes.read.path,
        pathParams: {
          [UrlKey.PUBLICATION_SLUG]: publicationSlug,
          [UrlKey.PUBLICATION_VERSION]: defaultPublicationVersion,
        },
        search: location.search,
      })}
    />
  );
};
