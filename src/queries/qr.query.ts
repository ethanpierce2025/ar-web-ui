import { ApiErrors, apiPath, getApiUrl, httpGet } from '@/utils/api-client';
import { useQuery } from '@tanstack/react-query';
import { queryKeys } from './keys';

export const useGetQrRedirectUrl = (params: { qrCode: string }) => {
  const { qrCode } = params;
  return useQuery<{ url: string }, ApiErrors>({
    queryFn: async () => {
      return await httpGet<{ url: string }>({
        url: getApiUrl({
          path: apiPath.getQrUrl,
          pathParams: { qrCode },
        }),
      });
    },
    queryKey: queryKeys.qr.getQrUrl,
  });
};
