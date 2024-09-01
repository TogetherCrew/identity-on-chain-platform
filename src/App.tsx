import './App.css';
import '@rainbow-me/rainbowkit/styles.css';

import React from 'react';
import { LitNetwork } from '@lit-protocol/constants';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import {
  getDefaultConfig,
  RainbowKitAuthenticationProvider,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Navigate, Route, Routes } from 'react-router-dom';
import { WagmiProvider } from 'wagmi';
import { sepolia } from 'wagmi/chains';

import { CustomSnackbar } from './components/shared/CustomSnackbar';
import { LitProvider } from './hooks/LitProvider';
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

const config = getDefaultConfig({
  appName: 'RainbowKit demo',
  projectId: '1cf030f3b91e339bc4e6ecf71a694a88',
  chains: [sepolia],
  ssr: false,
});

const App: React.FC = () => {
  const { authStatus, authenticationAdapter } = useSiweAuth();

  globalThis.Buffer = Buffer;

  return (
    <LitProvider litNetwork={LitNetwork.DatilDev}>
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <RainbowKitAuthenticationProvider
            adapter={authenticationAdapter}
            status={authStatus}
          >
            <RainbowKitProvider initialChain={sepolia}>
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
                      path="identifiers/:providers/attestation"
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
      </WagmiProvider>
    </LitProvider>
  );
};

export default App;
