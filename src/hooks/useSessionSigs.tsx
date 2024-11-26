/* eslint-disable @typescript-eslint/no-shadow */
import { useCallback, useState } from 'react';
import {
  AuthSig,
  createSiweMessageWithRecaps,
  generateAuthSig,
  LitAbility,
  LitActionResource,
} from '@lit-protocol/auth-helpers';
import { LitNodeClient } from '@lit-protocol/lit-node-client';
import { AuthCallbackParams, SessionSigsMap } from '@lit-protocol/types';
import { Signer } from 'ethers';

interface ICreateSessionSigs {
  signer: Signer;
  chainId: number;
  litNodeClient: LitNodeClient;
}

function useSessionSigs() {
  const [sessionSigs, setSessionSigs] = useState<SessionSigsMap | undefined>();

  const createSessionSigs = useCallback(
    async ({ signer, chainId, litNodeClient }: ICreateSessionSigs) => {
      if (!signer) {
        throw new Error('Undefined signer');
      }
      if (!chainId) {
        throw new Error('Undefined chainId');
      }
      if (!litNodeClient) {
        throw new Error('Undefined litNodeClient');
      }

      const authNeededCallback = async ({
        resourceAbilityRequests,
        expiration,
        uri,
      }: AuthCallbackParams): Promise<AuthSig> => {
        if (!uri) {
          throw new Error('Undefined uri');
        }
        if (!expiration) {
          throw new Error('Undefined expiration');
        }
        if (!resourceAbilityRequests) {
          throw new Error('Undefined resourceAbilityRequests');
        }

        const toSign = await createSiweMessageWithRecaps({
          uri,
          expiration,
          resources: resourceAbilityRequests,
          walletAddress: await signer.getAddress(),
          nonce: await litNodeClient.getLatestBlockhash(),
          litNodeClient,
        });
        const authSig = generateAuthSig({ signer, toSign });

        return authSig;
      };

      const sessionSigs = await litNodeClient.getSessionSigs({
        chain: 'sepolia',
        expiration: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
        resourceAbilityRequests: [
          {
            resource: new LitActionResource('*'),
            ability: LitAbility.LitActionExecution,
          },
        ],
        authNeededCallback,
      });
      setSessionSigs(sessionSigs);
    },
    []
  );

  return { sessionSigs, createSessionSigs };
}

export default useSessionSigs;
