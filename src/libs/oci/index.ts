import { Address, parseAbiItem } from 'viem';
import {
  SchemaDecodedItem,
  SchemaEncoder,
} from '@ethereum-attestation-service/eas-sdk';

import * as LitJsSdk from '@lit-protocol/lit-node-client';
import {  SessionSigsMap } from '@lit-protocol/types';
import { publicClient } from './client';
import sepoliaChain from '../../utils/contracts/eas/sepoliaChain.json';

import { SCHEMA_TYPES } from '../../utils/contracts/eas/constants';

export interface IAttestation {
  uid: `0x${string}`;
  schema: `0x${string}`;
  refUID: `0x${string}`;
  time: bigint;
  expirationTime: bigint;
  revocationTime: bigint;
  recipient: `0x${string}`;
  attester: `0x${string}`;
  revocable: boolean;
  data: `0x${string}`;
}

export interface ISchema {
  key: string;
  provider: string;
  secret: string;
}

export const getAttestationIds = async (recipient: `0x${string}`) => {
  const logs = await publicClient.getLogs({
    address: sepoliaChain.easContractAddress as Address,
    event: parseAbiItem(
      'event Attested(address indexed recipient, address indexed attester, bytes32 uid, bytes32 indexed schema)'
    ),
    args: {
      recipient,
      schema: sepoliaChain.easSchemaUUID as `0x${string}`,
    },
    fromBlock: BigInt(6530658),
  });

  return logs.map((log) => log.args.uid);
};

export const getAttestation = async (
  uid: `0x${string}`
): Promise<IAttestation> => {
  const attestation: IAttestation = (await publicClient.readContract({
    address: sepoliaChain.easContractAddress as Address,
    abi: sepoliaChain.easContractAbi,
    functionName: 'getAttestation',
    args: [uid],
  })) as IAttestation;

  return attestation;
};

export const getAttestations = async (recipient: `0x${string}`) => {
  const uids = await getAttestationIds(recipient);

  const attestations = await Promise.all(
    uids.map(async (uid) => {
      return getAttestation(uid as `0x${string}`);
    })
  );

  return attestations;
};

export const hasActiveRevocationTime = (attestations: IAttestation[]) => {
  return attestations.filter(
    (attestation) => attestation.revocationTime === 0n
  );
};

export const getAttestationData = (attestation: IAttestation) => {
  const schemaEncoder = new SchemaEncoder(SCHEMA_TYPES);

  const decodedData = schemaEncoder.decodeData(attestation.data);

  const data: ISchema = {
    key: decodedData[0].value.value as unknown as string,
    provider: decodedData[1].value.value as unknown as string,
    secret: decodedData[2].value.value as unknown as string,
  };

  return data;
};

export const getAttestationsData = (attestations: IAttestation[]) => {
  return attestations.map((attestation) => {
    return getAttestationData(attestation);
  });
};

export const decryptAttestation = async (
  litNodeClient: LitJsSdk.LitNodeClient,
  attestation: IAttestation,
  sessionSigs: SessionSigsMap
) => {
  const data = getAttestationData(attestation);
  const parsedJsonData = JSON.parse(data.secret) as EncryptToJsonPayload;

  const decryptedData = await LitJsSdk.decryptFromJson({
    litNodeClient,
    parsedJsonData,
    sessionSigs,
  });

  return JSON.parse(decryptedData);
};

export const decodeAttestationData = (data: string): SchemaDecodedItem[] => {
  const schemaEncoder = new SchemaEncoder(SCHEMA_TYPES);
  return schemaEncoder.decodeData(data);
};
