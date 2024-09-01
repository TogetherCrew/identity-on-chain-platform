import { useQuery } from '@tanstack/react-query';
import { gql } from 'graphql-request';
import { Address } from 'viem';

import { IAttestation } from '../../libs/oci';
import { EAS_SCHEMA_ID } from '../../utils/contracts/eas/constants';
import { ATTESTER_ADDRESS, graphQLClient } from '.';

interface AttestationsResponse {
  attestations: IAttestation[];
}

export const useGetAttestations = (recipient: Address) => {
  return useQuery<IAttestation[]>({
    queryKey: ['getAttestations', recipient],
    queryFn: async () => {
      const query = gql`
        query Attestations(
          $attester: String!
          $recipient: String!
          $schemaId: String!
        ) {
          attestations(
            where: {
              attester: { equals: $attester }
              recipient: { equals: $recipient }
              revoked: { equals: false }
              schemaId: { equals: $schemaId }
            }
          ) {
            id
            attester
            recipient
            refUID
            revocable
            revocationTime
            expirationTime
            data
          }
        }
      `;

      const variables = {
        attester: ATTESTER_ADDRESS,
        recipient,
        schemaId: EAS_SCHEMA_ID,
      };

      const attestedResults = await graphQLClient.request<AttestationsResponse>(
        query,
        variables
      );

      return attestedResults.attestations;
    },
    enabled: !!recipient,
  });
};
