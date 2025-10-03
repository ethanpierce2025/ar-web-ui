import { ApiErrors, apiPath, getApiUrl, httpGet } from '@/utils/api-client';
import { useQuery } from '@tanstack/react-query';
import { queryKeys } from './keys';

export function useGetPing() {
  return useQuery<boolean, ApiErrors>({
    queryFn: async () => {
      try {
        const url = getApiUrl({ path: apiPath.getPing, pathParams: {} });
        await httpGet({ url });
        return true;
      } catch (error) {
        return false;
      }
    },
    queryKey: queryKeys.ping.getPing,
  });
}
