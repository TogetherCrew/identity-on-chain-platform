import './App.css';
import '@rainbow-me/rainbowkit/styles.css';

import React, { useEffect, useState } from 'react';
import { LitNetwork } from '@lit-protocol/constants';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import {
  AuthenticationStatus,
  createAuthenticationAdapter,
  getDefaultConfig,
  RainbowKitAuthenticationProvider,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import { getAddress } from 'viem';
import { createSiweMessage } from 'viem/siwe';
import { WagmiProvider } from 'wagmi';
import { sepolia } from 'wagmi/chains';

import { CustomSnackbar } from './components/shared/CustomSnackbar';
import { LitProvider } from './hooks/LitProvider';
import DefaultLayout from './layouts/DefaultLayout';
import theme from './libs/theme';
import Login from './pages/Auth/Login';
import Callback from './pages/Callback';
// import Dashboard from './pages/Dashboard';
import Identifiers from './pages/Identifiers';
import Attestation from './pages/Identifiers/Attestation';
import Permissions from './pages/Permissions';
import ProtectedRoute from './ProtectedRoute';
import { api } from './services/api';

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
  const navigate = useNavigate();
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
      navigate('/auth/login');
      setAuthStatus('unauthenticated');
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
