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

export interface DecryptAttestationsSecretParams {
  uid: string;
  siweJwt: string;
  chainId?: number;
}

export interface GenerateDiscourseVerificationTokenParams {
  siweJwt: string;
}

export interface VerifyDiscourseTopicParams {
  topicUrl: string;
  verificationJwt: string;
}

export const linkIdentifier = async ({
  siweJwt,
  anyJwt,
  chainId,
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

export const decryptAttestationsSecret = async ({
  uid,
  siweJwt,
  chainId,
}: DecryptAttestationsSecretParams) => {
  return api.post(`/eas/${uid}/decrypt-attestation-secret`, {
    siweJwt,
    chainId,
  });
};

export const generateDiscourseVerificationToken = async ({
  siweJwt,
}: GenerateDiscourseVerificationTokenParams) => {
  return api.post('/discourse-verification/token', { siweJwt });
};

export const verifyDiscourseTopic = async ({
  topicUrl,
  verificationJwt,
}: VerifyDiscourseTopicParams) => {
  return api.post('/discourse-verification/verify', {
    topicUrl,
    verificationJwt,
  });
};
