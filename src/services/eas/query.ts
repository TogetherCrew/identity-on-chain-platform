import { useQuery } from '@tanstack/react-query';
import { gql } from 'graphql-request';
import { ATTESTER_ADDRESS, graphQLClient } from '.';
import { EAS_SCHEMA_ID } from '../../utils/contracts/eas/constants';
import { IAttestation } from '../../libs/oci';

interface AttestationsResponse {
  attestations: IAttestation[];
}

export const useGetAttestations = () => {
  return useQuery<IAttestation[]>({
    queryKey: ['getAttestations'],
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
        recipient: '0x026B727b60D336806B87d60e95B6d7FAd2443dD6',
        schemaId: EAS_SCHEMA_ID,
      };

      const attestedResults = await graphQLClient.request<AttestationsResponse>(
        query,
        variables
      );

      return attestedResults.attestations;
    },
  });
};
