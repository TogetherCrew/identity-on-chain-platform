import { useMemo } from 'react';
import { useAccount } from 'wagmi';

import { decodeAttestationData } from '../libs/oci';
import { useGetAttestations } from '../services/eas/query';

const useAttestations = () => {
  const { address, chainId } = useAccount();
  const {
    data: attestationsResponse,
    error,
    isLoading,
  } = useGetAttestations(address as `0x${string}`);

  const attestations = useMemo(() => {
    if (!attestationsResponse) {
      return [];
    }

    return attestationsResponse.map((attestation) => {
      const decodedData = decodeAttestationData(attestation.data);

      const providerData = decodedData.find((data) => data.name === 'provider');

      return {
        ...attestation,
        provider:
          typeof providerData?.value.value === 'string'
            ? providerData.value.value
            : undefined,
        decodedData,
      };
    });
  }, [attestationsResponse]);

  return {
    chainId,
    attestations,
    isLoading,
    error,
  };
};

export default useAttestations;
