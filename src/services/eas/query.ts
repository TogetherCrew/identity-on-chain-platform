import { useQuery } from '@tanstack/react-query';
import { gql } from 'graphql-request';
import { ATTESTER_ADDRESS, graphQLClient } from '.';
import { EAS_SCHEMA_ID } from '../../utils/contracts/eas/constants';

export const useGetAttestations = () => {
  return useQuery({
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

      const attestedResults = await graphQLClient.request(query, variables);

      console.log({ attestedResults });

      return attestedResults;
    },
  });
};

// const useGetAttestations = () => {
//   return useQuery({
//     queryKey: ['getAttestations'],
//     queryFn: async () => {
//       const result = await graphQLClient.request(gql`
//         query Attestations {
//           attestations(
//             where: {
//               attester: { equals: "0x2d7B3e18D45846DA09D78e3644F15BD4aafa634d" }
//               recipient: {
//                 equals: "0x026B727b60D336806B87d60e95B6d7FAd2443dD6"
//               }
//               revoked: { equals: false }
//               schemaId: {
//                 equals: "0x85e90e3e16d319578888790af3284fea8bca549305071531e7478e3e0b5e7d6d"
//               }
//             }
//           ) {
//             id
//             attester
//             recipient
//             refUID
//             revocable
//             revocationTime
//             expirationTime
//             data
//           }
//         }
//       `);

//       // Decode each attestation's data and log it
//       result.attestations.forEach((attestation: any) => {
//         const decodedData = decodedAttestations(attestation.data);
//         console.log({ decodedData });
//       });

//       // If you want to return decoded data, you can do something like this:
//       const decoded =
//         result &&
//         result.attestations.map((attestation: any) => ({
//           ...attestation,
//           decodedData: decodettestationData(attestation.data),
//         }));

//       return decoded; // or return result.attestations if you don't need the decoded data in the result
//     },
//   });
// };
