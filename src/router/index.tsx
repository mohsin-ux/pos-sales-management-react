import { createBrowserRouter, Navigate } from 'react-router';

import { RequireAuth } from '@/components/require-auth';
import { LoginForm } from '@/pages/login-form';
import { ROUTES } from '@/lib/constants';
import { HomePage } from '@/pages/home';

export const router = createBrowserRouter([
  {
    element: <RequireAuth />,
    children: [
      {
        path: ROUTES.HOME,
        element: <HomePage />,
      },
    ],
  },
  {
    path: ROUTES.LOGIN,
    element: <LoginForm />,
  },
  {
    path: '*',
    element: <Navigate to={ROUTES.HOME} replace />,
  },
]);
