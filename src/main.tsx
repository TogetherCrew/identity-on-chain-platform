import './index.css';

import React from 'react';
import { ThemeProvider } from '@emotion/react';
import { CssBaseline } from '@mui/material';
import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { arbitrum, baseSepolia, Chain } from 'viem/chains';
import { http, WagmiProvider } from 'wagmi';

import App from './App';
import theme from './libs/theme';

if (!import.meta.env.VITE_PROJECT_ID) {
  throw new Error('VITE_PROJECT_ID environment variable is required');
}
const projectID = import.meta.env.VITE_PROJECT_ID;

const isProduction = import.meta.env.VITE_IS_MAINNET === 'true';

export const SUPPORTED_CHAINS: Chain[] = isProduction
  ? [arbitrum]
  : [baseSepolia];

const config = getDefaultConfig({
  appName: 'Identity on chain platform',
  projectId: projectID,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  chains: SUPPORTED_CHAINS as any,
  transports: SUPPORTED_CHAINS.reduce(
    (obj, chain) => ({ ...obj, [chain.id]: http() }),
    {}
  ),
  ssr: false,
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <WagmiProvider config={config}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <App />
        </ThemeProvider>
      </WagmiProvider>
    </BrowserRouter>
  </React.StrictMode>
);
