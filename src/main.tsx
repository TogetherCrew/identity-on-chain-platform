import './index.css';

import React from 'react';
import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { baseSepolia, optimismSepolia } from 'viem/chains';
import { http, WagmiProvider } from 'wagmi';

import App from './App';

if (!import.meta.env.VITE_PROJECT_ID) {
  throw new Error('VITE_PROJECT_ID environment variable is required');
}
const projectID = import.meta.env.VITE_PROJECT_ID;

export const SUPPORTED_CHAINS = [baseSepolia, optimismSepolia];

const config = getDefaultConfig({
  appName: 'Identity on chain platform',
  projectId: projectID,
  chains: [optimismSepolia, baseSepolia],
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
        <App />
      </WagmiProvider>
    </BrowserRouter>
  </React.StrictMode>
);
