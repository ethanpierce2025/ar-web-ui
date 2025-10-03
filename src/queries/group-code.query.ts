import { apiPath, getApiUrl, httpGet } from '@/utils/api-client';
import { useAuth } from '@clerk/clerk-react';
import { useMutation } from '@tanstack/react-query';

export function useValidateGroupCode() {
  const { getToken } = useAuth();

  return useMutation({
    mutationFn: async (params: { editionId: number; groupCode: string; position: number }) => {
      const { editionId, groupCode, position } = params;

      await httpGet({
        accessToken: (await getToken()) ?? undefined,
        backgroundRequest: true,
        groupCode,
        queryStringParameters: { editionId, position },
        url: getApiUrl({ path: apiPath.getPassage, pathParams: {} }),
      });
    },
  });
}
