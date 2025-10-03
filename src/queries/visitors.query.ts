import { useNotification } from '@/hooks/notification';
import { VisitorSelectDto } from '@/types/api.types';
import { BrowserStorage } from '@/utils/storage';
import { useAuth } from '@clerk/clerk-react';
import { useQuery } from '@tanstack/react-query';
import { ApiErrors, ApiUnauthorized, apiPath, getApiUrl, httpGet } from '../utils/api-client';
import { queryKeys } from './keys';

export const useGetVisitor = () => {
  const { userId } = useAuth();
  const groupCode = BrowserStorage.getGroupCode();
  const notify = useNotification();

  return useQuery<VisitorSelectDto & { groupCodeValid: boolean }, ApiErrors>({
    enabled: Boolean(groupCode && !userId),
    queryFn: async () => {
      try {
        const visitor = await httpGet<VisitorSelectDto>({
          url: getApiUrl({
            path: apiPath.getVisitor,
            pathParams: {},
          }),
          groupCode,
        });
        return { groupCodeValid: true, features: visitor.features };
      } catch (error) {
        if (error instanceof ApiUnauthorized) {
          notify(error.message, {
            variant: 'error',
          });
          return { groupCodeValid: false, features: [] };
        }
        throw error;
      }
    },
    queryKey: queryKeys.visitors.getVisitor,
  });
};
