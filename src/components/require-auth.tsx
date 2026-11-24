import { Navigate, Outlet, useLocation } from 'react-router';

import { useCurrentUser } from '@/hooks/use-current-user';
import { ROUTES } from '@/lib/constants';
import { useAuthStore } from '@/store/auth-store';

/**
 * Guards protected routes. Unauthenticated users (no access token) or users
 * whose `/login/me` request failed are redirected to the login page.
 */
export function RequireAuth() {
  const location = useLocation();
  const { isError } = useCurrentUser();

  const user = useAuthStore((state) => state.user);

  if (isError || !user) {
    return <Navigate to={ROUTES.LOGIN} replace state={{ from: location }} />;
  }

  return <Outlet />;
}
