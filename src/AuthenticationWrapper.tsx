import {
  AuthenticationStatus,
  createAuthenticationAdapter,
  getDefaultConfig,
  RainbowKitAuthenticationProvider,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import { useState } from 'react';
import { RouterProvider } from 'react-router-dom';
import { getAddress } from 'viem';
import { sepolia } from 'wagmi/chains';
import { createSiweMessage } from 'viem/siwe';
import { WagmiProvider } from 'wagmi';
import { useAuth } from './context/authContext';
import { router } from './router';
import { api } from './services/api';

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
    ssr: false,
  });

  return (
    <WagmiProvider config={config}>
      <RainbowKitProvider initialChain={sepolia}>
        <RouterProvider router={router} />
      </RainbowKitProvider>
    </WagmiProvider>
  );
};

export default AuthenticationWrapper;

