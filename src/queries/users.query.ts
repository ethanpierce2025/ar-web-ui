import { User } from '@/types/user.type';
import { useAuth, useUser } from '@clerk/clerk-react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { ApiErrors, apiPath, getApiUrl, httpGet, httpPatch } from '../utils/api-client';
import { queryKeys } from './keys';

export const useGetCurrentUser = () => {
  const { getToken, userId } = useAuth();
  const clerkUser = useUser();

  return useQuery<User, ApiErrors>({
    enabled: Boolean(userId),
    queryFn: async () => {
      const token = await getToken();
      const user = await httpGet<User>({
        accessToken: token ?? '',
        url: getApiUrl({
          path: apiPath.getCurrentUser,
          pathParams: {},
        }),
      });

      if (clerkUser?.user) {
        user.firstName = clerkUser?.user?.firstName ?? undefined;
        user.lastName = clerkUser?.user?.lastName ?? undefined;
      }

      return user;
    },
    queryKey: queryKeys.users.getCurrentUser,
  });
};

export const useUpdateUserRole = () => {
  const { getToken } = useAuth();

  return useMutation<User, ApiErrors, { role: string }>({
    mutationFn: async ({ role }) => {
      const token = await getToken();
      return httpPatch<User>({
        accessToken: token ?? '',
        body: { role },
        url: getApiUrl({
          path: apiPath.updateUserRole,
          pathParams: {},
        }),
      });
    },
  });
};
