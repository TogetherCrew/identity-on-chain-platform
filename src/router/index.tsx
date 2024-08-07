import { createBrowserRouter } from 'react-router-dom';

import Login from '../pages/Auth/Login';
import Dashboard from '../pages/Dashboard';
import Identifiers from '../pages/Identifiers';
import Permissions from '../pages/Permissions';
import Attestation from '../pages/Identifiers/Attestation';

import DefaultLayout from '../layouts/DefaultLayout';
import ProtectedRoute from '../ProtectedRoute';

export const router = createBrowserRouter([
  {
    path: '/auth/login',
    element: <Login />,
  },
  {
    path: '/',
    element: <DefaultLayout />,
    children: [
      {
        path: '/',
        element: (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        ),
        index: true,
      },
      {
        path: '/identifiers',
        element: (
          <ProtectedRoute>
            <Identifiers />
          </ProtectedRoute>
        ),
      },
      {
        path: 'identifiers/:provider/attestation',
        element: (
          <ProtectedRoute>
            <Attestation />
          </ProtectedRoute>
        ),
      },
      {
        path: '/permissions',
        element: (
          <ProtectedRoute>
            <Permissions />
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: '*',
    element: <div>Not found</div>,
  },
]);
