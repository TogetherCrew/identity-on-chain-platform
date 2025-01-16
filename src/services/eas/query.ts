import { useQuery } from '@tanstack/react-query';
import { gql, GraphQLClient } from 'graphql-request';
import { Address } from 'viem';

import { IAttestation } from '../../interfaces';
import { EAS_SCHEMA_ID } from '../../utils/contracts/eas/constants';
import { ATTESTER_ADDRESS, chainIdToGraphQLEndpoint } from '.';

interface AttestationsResponse {
  attestations: IAttestation[];
}

export const useGetAttestations = (recipient: Address, chainId: number) => {
  const graphqlClient = new GraphQLClient(chainIdToGraphQLEndpoint[chainId]);

  return useQuery<IAttestation[]>({
    queryKey: ['getAttestations', recipient, chainId],
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
            decodedDataJson
          }
        }
      `;

      const variables = {
        attester: ATTESTER_ADDRESS,
        recipient,
        schemaId: EAS_SCHEMA_ID[chainId],
      };

      const attestedResults = await graphqlClient.request<AttestationsResponse>(
        query,
        variables
      );

      return attestedResults.attestations;
    },
    enabled: !!recipient || !chainId,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    staleTime: 0,
  });
};
