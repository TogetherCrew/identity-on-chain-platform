import React, { useState } from 'react';
import './App.css';
import '@rainbow-me/rainbowkit/styles.css';
import { RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import {
  getDefaultConfig,
  RainbowKitProvider,
  RainbowKitAuthenticationProvider,
  createAuthenticationAdapter,
  AuthenticationStatus,
} from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import { sepolia } from 'viem/chains';
import { getAddress } from 'viem';
import { createSiweMessage } from 'viem/siwe';
import theme from './libs/theme';
import { router } from './router';
import { api } from './api';
import { AuthProvider, useAuth } from './context/authContext';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
      staleTime: 1000 * 60 * 5,
    },
  },
});

const AuthenticationWrapper: React.FC = () => {
  const { setAuthInfo, signOut } = useAuth();
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
        setAuthStatus('authenticated');
        setAuthInfo(data.jwt);
        window.location.replace('/');
      } else {
        setAuthStatus('unauthenticated');
      }

      return data;
    },
    signOut: async () => {
      setAuthStatus('unauthenticated');
      signOut();
    },
  });

  const config = getDefaultConfig({
    appName: 'RainbowKit demo',
    projectId: '1cf030f3b91e339bc4e6ecf71a694a88',
    chains: [sepolia],
  });

  return (
    <WagmiProvider config={config}>
      <RainbowKitAuthenticationProvider
        adapter={authenticationAdapter}
        status={authStatus}
      >
        <RainbowKitProvider>
          <RouterProvider router={router} />
        </RainbowKitProvider>
      </RainbowKitAuthenticationProvider>
    </WagmiProvider>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <AuthenticationWrapper />
        </ThemeProvider>
      </QueryClientProvider>
    </AuthProvider>
  );
};

export default App;
