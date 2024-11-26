import './index.css';

import React from 'react';
import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { baseSepolia, optimismSepolia } from 'viem/chains';
import { WagmiProvider } from 'wagmi';

import App from './App';

const projectID = import.meta.env.VITE_PROJECT_ID;

const config = getDefaultConfig({
  appName: 'Identity on chain platform',
  projectId: projectID,
  chains: [optimismSepolia, baseSepolia],
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
