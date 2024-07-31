import { createBrowserRouter } from 'react-router-dom';

import Login from '../pages/Auth/Login';
import Dashboard from '../pages/Dashboard';
import Identifiers from '../pages/Identifiers';
import Permissions from '../pages/Permissions';
import Attestation from '../pages/Identifiers/Attestation';

import DefaultLayout from '../layouts/DefaultLayout';

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
        element: <Dashboard />,
        index: true,
      },
      {
        path: '/identifiers',
        element: <Identifiers />,
      },
      {
        path: '/attestation',
        element: <Attestation />,
      },
      {
        path: '/permissions',
        element: <Permissions />,
      },
    ],
  },
  {
    path: '*',
    element: <div>Not found</div>,
  },
]);
