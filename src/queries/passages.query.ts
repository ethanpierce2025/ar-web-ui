import { useApp } from '@/context/app.context';
import { routes } from '@/routes/routes';
import {
  AudioSelectDto,
  EditionPassageDto,
  GetPassageParams1,
  PassageAudioOnDemandDto,
  PassageDecodeResponseDto,
  SpeechMarksResponseDto,
} from '@/types/api.types';
import { ApiErrors, ApiForbidden, ApiUnauthorized, apiPath, getApiUrl, httpGet } from '@/utils/api-client';
import { useAuth } from '@clerk/clerk-react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { queryClient } from './client';
import { queryKeys } from './keys';

const premiumContentErrorMessage = 'Premium content';

export type GetPassageResult = { groupCodeRequired: boolean; licenseRequired?: boolean; passage?: EditionPassageDto };

export type GetPassageAudioResult = {
  groupCodeRequired: boolean;
  audio?: AudioSelectDto;
};

export function useGetPassage(params: { backgroundRequest?: boolean; editionId?: number; position: number }) {
  const { backgroundRequest, editionId, position } = params;

  const { groupCode } = useApp();
  const { getToken } = useAuth();
  const navigate = useNavigate();

  const queryParams: Partial<GetPassageParams1> | undefined = { editionId, position };
  const queryKey = queryParams
    ? queryKeys.passages.getPassage({ ...queryParams, groupCode })
    : queryKeys.placeholder.default;

  return useQuery<GetPassageResult, ApiErrors>({
    enabled: Boolean(editionId),
    queryFn: async () => {
      try {
        if (position <= 0) {
          throw new ApiErrors({ errors: [{ code: 404, message: 'Passage not found' }] });
        }

        const passage = await httpGet<EditionPassageDto>({
          accessToken: (await getToken()) ?? undefined,
          backgroundRequest,
          groupCode,
          queryStringParameters: queryParams,
          url: getApiUrl({ path: apiPath.getPassage, pathParams: {} }),
        });

        return { groupCodeRequired: false, passage };
      } catch (error) {
        if (error instanceof ApiUnauthorized) {
          if (error.message === premiumContentErrorMessage) {
            navigate(routes.catalog.path);
          }

          return { groupCodeRequired: true };
        }
        if (error instanceof ApiForbidden) {
          return { groupCodeRequired: false, licenseRequired: true };
        }
        throw error;
      }
    },
    queryKey,
  });
}

export function useGetPassageAudio() {
  const { groupCode } = useApp();
  const { getToken } = useAuth();

  return useMutation<
    GetPassageAudioResult,
    ApiErrors,
    {
      backgroundRequest?: boolean;
      passageId?: number;
      sourceId?: number;
    }
  >({
    mutationFn: async ({ backgroundRequest, passageId, sourceId }) => {
      if (passageId === undefined) {
        throw new Error('passageId is required');
      }

      const audio = await httpGet<AudioSelectDto>({
        accessToken: (await getToken()) ?? undefined,
        backgroundRequest,
        groupCode,
        url: getApiUrl({
          path: apiPath.getPassageAudio,
          pathParams: { passageId },
        }),
        queryStringParameters: { editionId: sourceId },
      });

      return { audio, groupCodeRequired: false };
    },
    onError: (error) => {
      console.error('Error fetching passage audio:', error);
    },
  });
}

export function useDecodePassage() {
  const { groupCode } = useApp();
  const { getToken } = useAuth();

  return useMutation<
    PassageDecodeResponseDto,
    ApiErrors,
    {
      passageId: number;
      editionId: number;
      position: number;
    }
  >({
    mutationFn: async ({ passageId, editionId }) => {
      return await httpGet<PassageDecodeResponseDto>({
        accessToken: (await getToken()) ?? undefined,
        groupCode,
        url: getApiUrl({
          path: apiPath.getPassageDecode,
          pathParams: { passageId },
        }),
        queryStringParameters: { editionId },
      });
    },
    onSuccess: (data, { editionId, position }) => {
      queryClient.setQueryData<GetPassageResult>(
        queryKeys.passages.getPassage({ editionId, position, groupCode }),
        (oldData): GetPassageResult | undefined => {
          if (!oldData?.passage) return oldData;
          return {
            ...oldData,
            passage: {
              ...oldData.passage,
              textDecoded: data.textDecoded,
            },
          };
        },
      );
    },
  });
}

export function useGetAudioOnlyPassage(params: {
  backgroundRequest?: boolean;
  editionId?: number;
  position: number;
}) {
  const { groupCode } = useApp();
  const { getToken } = useAuth();

  return useQuery<GetPassageResult, ApiErrors>({
    queryKey: queryKeys.passages.getAudioOnlyPassage({
      editionId: params.editionId,
      groupCode,
      position: params.position,
    }),
    queryFn: async () => {
      if (params.editionId === undefined) {
        throw new Error('editionId is required');
      }

      const passage = await httpGet<EditionPassageDto>({
        accessToken: (await getToken()) ?? undefined,
        backgroundRequest: params.backgroundRequest,
        groupCode,
        url: getApiUrl({
          path: apiPath.getPassageAudioOnly,
          pathParams: {},
          search: `editionId=${params.editionId}&position=${params.position}`,
        }),
      });

      return { passage, groupCodeRequired: false };
    },
    enabled: params.editionId !== undefined,
  });
}

export function useGetAudioOnlyPassageOnDemand() {
  const { groupCode } = useApp();
  const { getToken } = useAuth();

  return useMutation<
    GetPassageAudioResult,
    ApiErrors,
    {
      backgroundRequest?: boolean;
      passageId?: number;
      sourceId?: number;
      audioParams?: PassageAudioOnDemandDto;
    }
  >({
    mutationFn: async ({ backgroundRequest, passageId, sourceId, audioParams }) => {
      if (passageId === undefined) {
        throw new Error('passageId is required');
      }

      const audio = await httpGet<AudioSelectDto>({
        accessToken: (await getToken()) ?? undefined,
        backgroundRequest,
        groupCode,
        url: getApiUrl({
          path: apiPath.getPassageAudioOnlyOnDemand,
          pathParams: { passageId },
        }),
        queryStringParameters: { editionId: sourceId, ...audioParams },
      });

      return { audio, groupCodeRequired: false };
    },
    onError: (error) => {
      console.error('Error fetching passage audio on demand:', error);
    },
  });
}

export function useGetPassageSpeechMarks() {
  const { groupCode } = useApp();
  const { getToken } = useAuth();

  return useMutation<
    SpeechMarksResponseDto,
    ApiErrors,
    {
      passageId: number;
    }
  >({
    mutationFn: async ({ passageId }) => {
      return await httpGet<SpeechMarksResponseDto>({
        accessToken: (await getToken()) ?? undefined,
        groupCode,
        url: getApiUrl({
          path: apiPath.getPassageSpeechMarks,
          pathParams: { passageId },
        }),
      });
    },
    onError: (error) => {
      console.error('Error fetching passage speech marks:', error);
    },
  });
}
