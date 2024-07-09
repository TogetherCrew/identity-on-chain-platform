import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import Dashboard from '@/pages/Dashboard';
import DefaultLayout from '@/layouts/DefaultLayout';

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
    ],
  },
  {
    path: '*',
    element: <div>Not found</div>,
  },
]);
