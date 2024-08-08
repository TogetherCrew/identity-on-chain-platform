import { useMutation } from '@tanstack/react-query';
import { linkIdentifier, LinkIdentifierParams } from '.';

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
