import { useMutation } from '@tanstack/react-query';

import {
  decryptAttestationsSecret,
  DecryptAttestationsSecretParams,
  linkIdentifier,
  LinkIdentifierParams,
  revokeIdentifier,
  RevokeIdentifierParams,
} from '.';

export const useLinkIdentifierMutation = (chainId: number) => {
  return useMutation({
    mutationFn: async ({ siweJwt, anyJwt }: LinkIdentifierParams) => {
      return linkIdentifier({
        siweJwt,
        anyJwt,
        chainId,
      });
    },
    mutationKey: ['linkIdentifier'],
  });
};

export const useRevokeIdentifierMutation = () => {
  return useMutation({
    mutationFn: async ({ uid, siweJwt, chainId }: RevokeIdentifierParams) => {
      return revokeIdentifier({
        uid,
        siweJwt,
        chainId,
      });
    },
    mutationKey: ['revokeIdentifier'],
  });
};

export const useDecryptAttestationsSecretMutation = () => {
  return useMutation({
    mutationFn: async ({
      uid,
      siweJwt,
      chainId,
    }: DecryptAttestationsSecretParams) => {
      return decryptAttestationsSecret({
        uid,
        siweJwt,
        chainId,
      });
    },
    mutationKey: ['decryptAttestationsSecret'],
  });
};
