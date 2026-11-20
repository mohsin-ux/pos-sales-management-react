import { useQuery } from '@tanstack/react-query';

import { authApi } from '@/lib/auth-api';
import { STORAGE_KEYS } from '@/lib/constants';
import { type User } from '@/lib/types';
import { useAuthStore } from '@/store/auth-store';

export const CURRENT_USER_QUERY_KEY = ['current-user'] as const;

/**
 * Fetches the authenticated user's info from `/auth/me` when an access token
 * is available and keeps the auth store in sync with the result.
 */
export function useCurrentUser() {
  const setUser = useAuthStore((state) => state.setUser);
  const hasAccessToken = Boolean(localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN));

  const query = useQuery<User>({
    queryKey: CURRENT_USER_QUERY_KEY,
    queryFn: async () => {
      const user = await authApi.me();
      setUser(user);
      return user;
    },
    enabled: hasAccessToken,
  });

  return query;
}
