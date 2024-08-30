import React, { useEffect, useState } from 'react';
import './App.css';
import '@rainbow-me/rainbowkit/styles.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Route, Routes, Navigate } from 'react-router-dom';
import { WagmiProvider } from 'wagmi';
import {
  AuthenticationStatus,
  createAuthenticationAdapter,
  getDefaultConfig,
  RainbowKitAuthenticationProvider,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import { sepolia } from 'wagmi/chains';
import { getAddress } from 'viem';
import { createSiweMessage } from 'viem/siwe';
import { LitNetwork } from '@lit-protocol/constants';
import Login from './pages/Auth/Login';
import theme from './libs/theme';
import { api } from './services/api';

import DefaultLayout from './layouts/DefaultLayout';

// import Dashboard from './pages/Dashboard';
import Identifiers from './pages/Identifiers';
import Permissions from './pages/Permissions';
import Attestation from './pages/Identifiers/Attestation';
import Callback from './pages/Callback';
import ProtectedRoute from './ProtectedRoute';
import { LitProvider } from './hooks/LitProvider';
import { CustomSnackbar } from './components/shared/CustomSnackbar';

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
  const [authStatus, setAuthStatus] =
    useState<AuthenticationStatus>('unauthenticated');

  const authenticationAdapter = createAuthenticationAdapter({
    getNonce: async () => {
      const { data } = await api.get('auth/siwe/nonce');
      return data.nonce;
    },
    createMessage: ({ nonce, address, chainId }) => {
      return createSiweMessage({
        address: getAddress(address),
        chainId,
        domain: window.location.host,
        nonce,
        uri: window.location.origin,
        version: '1',
        statement: 'Sign in with Ethereum to the app.',
      });
    },
    getMessageBody: ({ message }) => message,
    verify: async ({ message, signature }) => {
      const { data } = await api.post('auth/siwe/verify', {
        message,
        signature,
        chainId: 11155111,
      });

      if (!data) {
        throw new Error('Verification response data is empty');
      }

      if (data?.jwt) {
        localStorage.setItem('OCI_TOKEN', data.jwt);
        setAuthStatus('authenticated');
        return true;
      }

      return false;
    },
    signOut: async () => {
      localStorage.removeItem('OCI_TOKEN');
    },
  });

  useEffect(() => {
    const checkStoredToken = () => {
      const OCI_TOKEN = localStorage.getItem('OCI_TOKEN');
      if (OCI_TOKEN) {
        setAuthStatus('authenticated');
      } else {
        setAuthStatus('unauthenticated');
      }
    };

    checkStoredToken();
  }, []);

  useEffect(() => {
    console.log('authStatus', authStatus);
  }, [authStatus]);

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
