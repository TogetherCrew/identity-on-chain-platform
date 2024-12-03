import './App.css';
import '@rainbow-me/rainbowkit/styles.css';

import React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import {
  lightTheme,
  RainbowKitAuthenticationProvider,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Navigate, Route, Routes } from 'react-router-dom';
import { baseSepolia } from 'viem/chains';
import { useAccount } from 'wagmi';

import { CustomSnackbar } from './components/shared/CustomSnackbar';
import useSiweAuth from './hooks/useSiweAuth';
import DefaultLayout from './layouts/DefaultLayout';
import theme from './libs/theme';
import Login from './pages/Auth/Login';
import Callback from './pages/Callback';
import Identifiers from './pages/Identifiers';
import Attestation from './pages/Identifiers/Attestation';
import Permissions from './pages/Permissions';
import ProtectedRoute from './ProtectedRoute';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
      staleTime: 1000 * 60 * 5,
    },
  },
});

const App: React.FC = () => {
  const { authStatus, authenticationAdapter } = useSiweAuth();
  const { chainId } = useAccount();

  globalThis.Buffer = Buffer;

  return (
    <QueryClientProvider client={queryClient}>
      <RainbowKitAuthenticationProvider
        adapter={authenticationAdapter}
        status={authStatus}
      >
        <RainbowKitProvider
          initialChain={chainId ?? baseSepolia}
          theme={lightTheme({
            accentColor: '#4200FF',
          })}
          appInfo={{
            appName: 'LogID',
          }}
        >
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <Routes>
              <Route
                path="/auth/login"
                element={
                  authStatus === 'authenticated' ? (
                    <Navigate to="/" replace />
                  ) : (
                    <Login />
                  )
                }
              />
              <Route
                element={
                  <ProtectedRoute>
                    <DefaultLayout />
                  </ProtectedRoute>
                }
              >
                <Route path="/" element={<Navigate to="/identifiers" />} />
                <Route path="/identifiers" element={<Identifiers />} />
                <Route
                  path="identifiers/:provider/attestation"
                  element={<Attestation />}
                />
                <Route path="/permissions" element={<Permissions />} />
              </Route>
              <Route path="/callback" element={<Callback />} />
              <Route path="*" element={<div>Not found</div>} />
            </Routes>
            <CustomSnackbar />
          </ThemeProvider>
        </RainbowKitProvider>
      </RainbowKitAuthenticationProvider>
    </QueryClientProvider>
  );
};

export default App;
