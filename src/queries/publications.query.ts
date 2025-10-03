import { englishLanguageKey } from '@/constants';
import { routes } from '@/routes/routes';
import { CreateOnDemandSourceDto, GetReaderTitleParams } from '@/types/api.types';
import { Publication } from '@/types/publication.types';
import { ApiErrors, ApiUnauthorized, apiPath, getApiUrl, httpGet, httpPost } from '@/utils/api-client';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { queryClient } from './client';
import { queryKeys } from './keys';

const premiumContentErrorMessage = 'Premium content';

export function useGetPublication(params: GetReaderTitleParams) {
  const navigate = useNavigate();

  return useQuery<Publication, ApiErrors>({
    queryFn: async () => {
      try {
        const publication = await httpGet<Publication>({
          url: getApiUrl({
            path: apiPath.getPublication,
            pathParams: { publicationSlug: params.titleSlug },
            search: 'version=' + params.version,
          }),
        });

        publication.englishEditions = publication.editions.filter(
          ({ language }) => language.code === englishLanguageKey,
        );

        publication.otherLanguagesEditions = publication.editions.filter(
          ({ language }) => language.code !== englishLanguageKey,
        );

        return publication;
      } catch (error) {
        if (error instanceof ApiUnauthorized && error.message === premiumContentErrorMessage) {
          navigate(routes.catalog.path);
        }

        throw error;
      }
    },
    queryKey: queryKeys.publications.getPublication({
      publicationSlug: params.titleSlug,
      publicationVersion: params.version,
    }),
  });
}

export type GetPublicationsResponse = {
  publications: Publication[];
};

export function useGetPublications() {
  const url = getApiUrl({
    path: `${apiPath.getPublications}`,
    pathParams: {},
  });

  return {
    query: useQuery<GetPublicationsResponse, ApiErrors>({
      queryFn: async () =>
        httpGet<GetPublicationsResponse>({
          url,
        }),
      queryKey: queryKeys.publications.getPublications(),
    }),
  };
}

export const createOnDemandSourceForPublication = () => {
  const { publicationSlug } = useParams<{
    publicationSlug: string;
  }>();

  return useMutation<
    { url: string },
    ApiErrors,
    {
      body: CreateOnDemandSourceDto;
    }
  >({
    mutationFn: async ({ body }) => {
      return await httpPost<{ url: string }>({
        url: getApiUrl({
          path: apiPath.createOnDemandSourceForPublication,
          pathParams: { publicationSlug: publicationSlug! },
        }),
        body,
      });
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.publications.getPublications(),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.publications.getPublication({
          publicationSlug: publicationSlug!,
          publicationVersion: variables.body.version,
        }),
      });
    },
  });
};
