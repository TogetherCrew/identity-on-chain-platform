import { api } from '..';

export interface LinkIdentifierParams {
  siweJwt: string;
  anyJwt: string;
  chainId?: number;
}

export const linkIdentifier = async ({
  siweJwt,
  anyJwt,
  chainId = 11155111,
}: LinkIdentifierParams) => {
  return api.post('/eas/sign-delegated-attestation', {
    siweJwt,
    anyJwt,
    chainId,
  });
};
