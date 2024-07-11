import { createBrowserRouter } from 'react-router-dom';

import Dashboard from '../pages/Dashboard';
import Identifiers from '../pages/Identifiers';
import Permissions from '../pages/Permissions';

import DefaultLayout from '../layouts/DefaultLayout';

export const router = createBrowserRouter([
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
        path: '/idenifiers',
        element: <Identifiers />,
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
