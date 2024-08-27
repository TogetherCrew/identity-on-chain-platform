import { useMutation } from '@tanstack/react-query';
import {
  linkIdentifier,
  LinkIdentifierParams,
  revokeIdentifier,
  RevokeIdentifierParams,
} from '.';

export const useLinkIdentifierMutation = () => {
  return useMutation({
    mutationFn: async ({
      siweJwt,
      anyJwt,
      chainId = 11155111,
    }: LinkIdentifierParams) => {
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
