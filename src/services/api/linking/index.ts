import { api } from '..';

export interface LinkIdentifierParams {
  siweJwt: string;
  anyJwt: string;
  chainId?: number;
}

export interface RevokeIdentifierParams {
  uid: string;
  siweJwt: string;
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

export const revokeIdentifier = async ({
  uid,
  siweJwt,
  chainId,
}: RevokeIdentifierParams) => {
  return api.post(`/eas/${uid}/sign-delegated-revocation`, {
    siweJwt,
    chainId,
  });
};
