import {
  createContext,
  ReactElement,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { LitNetwork } from '@lit-protocol/constants';
import { LitNodeClient } from '@lit-protocol/lit-node-client';

interface ILitProvider {
  litNetwork: LitNetwork;
  children: ReactElement;
}

const defaultLitNodeClient = new LitNodeClient({
  litNetwork: LitNetwork.DatilDev,
});
const LitClientContext = createContext({
  litNodeClient: defaultLitNodeClient,
  litConnected: false,
});

export const LitProvider = ({ litNetwork, children }: ILitProvider) => {
  const client = useMemo(
    () =>
      new LitNodeClient({
        alertWhenUnauthorized: false,
        litNetwork,
        debug: true,
      }),
    [litNetwork] // Include litNetwork as a dependency
  );

  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const connect = async () => {
      try {
        await client.connect();
        setConnected(true);
        console.log(`Connected to Lit Network: ${litNetwork}`);
      } catch (error) {
        console.error('Failed to connect to Lit Network:', error);
        setConnected(false);
      }
    };

    connect();

    return () => {
      // Add cleanup if necessary, e.g., disconnect the client
      client.disconnect?.();
    };
  }, [client, litNetwork]); // Include client as a dependency

  const contextValue = useMemo(
    () => ({ litNodeClient: client, litConnected: connected }),
    [client, connected] // Memoize the context value to avoid unnecessary re-renders
  );

  return (
    <LitClientContext.Provider value={contextValue}>
      {children}
    </LitClientContext.Provider>
  );
};

export default function useLit() {
  return useContext(LitClientContext);
}
