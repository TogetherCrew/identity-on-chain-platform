import { useEffect, useState } from 'react';
import { SchemaDecodedItem } from '@ethereum-attestation-service/eas-sdk';
import { useAccount } from 'wagmi';

import { decodeAttestationData } from '../libs/oci';
import { useGetAttestations } from '../services/eas/query';

interface ProcessedAttestation {
  provider: string | undefined;
  decodedData: SchemaDecodedItem[];
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
  id?: string;
}

const useAttestations = () => {
  const { address, chainId } = useAccount();
  const {
    data: attestationsResponse,
    error,
    isLoading,
    refetch,
  } = useGetAttestations(address as `0x${string}`, chainId as number);

  const [attestations, setAttestations] = useState<ProcessedAttestation[]>([]);

  useEffect(() => {
    if (attestationsResponse) {
      const processedAttestations: ProcessedAttestation[] =
        attestationsResponse.map((attestation) => {
          const decodedData = decodeAttestationData(attestation.data);

          const providerData = decodedData.find(
            (data) => data.name === 'provider'
          );

          return {
            ...attestation,
            provider:
              typeof providerData?.value.value === 'string'
                ? providerData.value.value
                : undefined,
            decodedData,
          };
        });

      setAttestations(processedAttestations);
    }
  }, [attestationsResponse]);

  return {
    chainId,
    attestations,
    isLoading,
    error,
    refetch,
  };
};

export default useAttestations;
