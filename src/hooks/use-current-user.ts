import { useQuery } from '@tanstack/react-query';

import { authApi } from '@/lib/auth-api';
import { type User } from '@/lib/types';
import { useAuthStore } from '@/store/auth-store';

export const CURRENT_USER_QUERY_KEY = ['current-user'] as const;

/**
 * Fetches the authenticated user's info from `/auth/me` when an access token
 * is available and keeps the auth store in sync with the result.
 */
export function useCurrentUser() {
  const setUser = useAuthStore((state) => state.setUser);
  const user = useAuthStore((state) => state.user);

  const query = useQuery<User>({
    queryKey: CURRENT_USER_QUERY_KEY,
    queryFn: async () => {
      const user = await authApi.me();
      setUser(user);
      return user;
    },
    // Only run if we don't have a user yet, OR if we explicitly want to check
    enabled: user !== null,
    retry: false, // Don't retry 401s
    staleTime: Infinity, // Keep the user data fresh until manually invalidated (e.g., on logout)
  });

  return query;
}
