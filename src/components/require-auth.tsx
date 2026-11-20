import { Navigate, Outlet, useLocation } from 'react-router';

import { useCurrentUser } from '@/hooks/use-current-user';
import { ROUTES, STORAGE_KEYS } from '@/lib/constants';

/**
 * Guards protected routes. Unauthenticated users (no access token) or users
 * whose `/login/me` request failed are redirected to the login page.
 */
export function RequireAuth() {
  const location = useLocation();
  const { isError } = useCurrentUser();
  const hasAccessToken = Boolean(localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN));

  if (!hasAccessToken || isError) {
    return <Navigate to={ROUTES.LOGIN} replace state={{ from: location }} />;
  }

  return <Outlet />;
}
