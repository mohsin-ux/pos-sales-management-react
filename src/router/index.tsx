import { createBrowserRouter, Navigate } from 'react-router';

import { LoginForm } from '@/components/login-form';
import { ROUTES } from '@/lib/constants';
import { HomePage } from '@/pages/home';

export const router = createBrowserRouter([
  {
    path: ROUTES.HOME,
    element: <HomePage />,
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
