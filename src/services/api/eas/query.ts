import { useMutation } from '@tanstack/react-query';

import {
  decryptAttestationsSecret,
  DecryptAttestationsSecretParams,
  generateDiscourseVerificationToken,
  GenerateDiscourseVerificationTokenParams,
  linkIdentifier,
  LinkIdentifierParams,
  revokeIdentifier,
  RevokeIdentifierParams,
  verifyDiscourseTopic,
  VerifyDiscourseTopicParams,
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

export const useGenerateDiscourseVerificationTokenMutation = () => {
  return useMutation({
    mutationFn: async ({
      siweJwt,
    }: GenerateDiscourseVerificationTokenParams) => {
      return generateDiscourseVerificationToken({ siweJwt });
    },
    mutationKey: ['generateDiscourseVerificationToken'],
  });
};

export const useVerifyDiscourseTopicMutation = () => {
  return useMutation({
    mutationFn: async ({
      topicUrl,
      verificationJwt,
    }: VerifyDiscourseTopicParams) => {
      return verifyDiscourseTopic({ topicUrl, verificationJwt });
    },
    mutationKey: ['verifyDiscourseTopic'],
  });
};
