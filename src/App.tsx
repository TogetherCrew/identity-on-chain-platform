import React, { useEffect } from 'react';
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
} from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import { sepolia } from 'viem/chains';
import theme from './libs/theme';
import { router } from './router';

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
});

const App: React.FC = () => {
  const authStatus = useAuthStatus();

  useEffect(() => {
    console.log('Auth status changed:', authStatus);
  }, [authStatus]);

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <RainbowKitAuthenticationProvider
            adapter={authAdapter}
            status={authStatus}
          >
            <RainbowKitProvider>
              <RouterProvider router={router} />
            </RainbowKitProvider>
          </RainbowKitAuthenticationProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};

export default App;
