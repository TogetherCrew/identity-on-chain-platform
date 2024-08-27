import { GraphQLClient } from 'graphql-request';

export const easBaseUrl = import.meta.env.VITE_API_GRAPHQL_URL;
export const ATTESTER_ADDRESS = import.meta.env.VITE_EAS_ATTESTER_ADDRESS;

if (!easBaseUrl) {
  throw new Error('VITE_API_GRAPHQL_URL is not defined');
}

export const graphQLClient = new GraphQLClient(easBaseUrl);
