import { useEffect, useState } from 'react';
import {
  AuthenticationStatus,
  createAuthenticationAdapter,
} from '@rainbow-me/rainbowkit';
import { useNavigate } from 'react-router-dom';
import { getAddress } from 'viem';
import { createSiweMessage } from 'viem/siwe';
import { useAccount } from 'wagmi';

import { api } from '../services/api';

const useSiweAuth = () => {
  const { chainId } = useAccount();

  const navigate = useNavigate();
  const [authStatus, setAuthStatus] =
    useState<AuthenticationStatus>('unauthenticated');

  const authenticationAdapter = createAuthenticationAdapter({
    getNonce: async () => {
      const { data } = await api.get('auth/siwe/nonce');
      return data.nonce;
    },
    createMessage: ({ nonce, address }) => {
      return createSiweMessage({
        address: getAddress(address),
        chainId: chainId as number,
        domain: window.location.host,
        nonce,
        uri: window.location.origin,
        version: '1',
        statement: 'Sign in with Ethereum to the app.',
      });
    },
    // getMessageBody: ({ message }) => message,
    verify: async ({ message, signature }) => {
      const { data } = await api.post('auth/siwe/verify', {
        message,
        signature,
        chainId: chainId as number,
      });

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

  return { authStatus, authenticationAdapter };
};

export default useSiweAuth;
