/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  useAccount,
  useReadContract,
  useReadContracts,
  useWriteContract,
} from 'wagmi';
import { Abi, Address } from 'viem';
import { useEffect, useState } from 'react';
import sepoliaChainAppConctract from '../../utils/contracts/app/sepoliaChain.json';
import sepoliaChainOidonctract from '../../utils/contracts/oid/sepoliaChain.json';
import useSessionSigs from '../../hooks/useSessionSigs';
import useLit from '../../hooks/LitProvider';
import { useSigner } from '../../utils/eas-wagmi-utils';
import { decryptAttestation, getAttestations } from '../../libs/oci';
import CustomTable, {
  AccessData,
  Platform,
} from '../../components/shared/CustomTable';

interface IProvider {
  uid: string;
  provider: string;
  id: string;
}

export function Permissions() {
  const signer = useSigner();
  const { litNodeClient } = useLit();
  const { sessionSigs, createSessionSigs } = useSessionSigs();

  const { isConnected, address, chainId } = useAccount();
  const [applicationsArgs, setApplicationsArgs] = useState<[number, number]>([
    0, 10,
  ]);
  const { writeContract } = useWriteContract();

  const [providers, setProviders] = useState<IProvider[]>([]);
  const [uids, setUids] = useState<string[]>([]);

  const { data: applications } = useReadContract({
    abi: sepoliaChainAppConctract.appContractABI,
    address: sepoliaChainAppConctract.appContractAddress as Address,
    functionName: 'getApplications',
    args: applicationsArgs,
  });

  useEffect(() => {
    if (!isConnected) throw new Error('Wallet not connected');
  }, [isConnected, applications]);

  const contractCalls = uids.flatMap((uid) =>
    applications.map((application) => ({
      abi: sepoliaChainOidonctract.oidContractAbi as Abi,
      address: sepoliaChainOidonctract.oidContractAddress as Address,
      functionName: 'hasPermission',
      args: [uid, application.account],
    }))
  );

  const { data: hasPermissionsOnApp } = useReadContracts({
    contracts: contractCalls,
  });

  console.log({ hasPermissionsOnApp });

  const permissionsWithUidsAndApps =
    hasPermissionsOnApp
      ?.map((permissionResult, index) => {
        const uidIndex = Math.floor(index / applications.length);
        const appIndex = index % applications.length;

        if (!permissionResult || typeof permissionResult.result !== 'boolean') {
          console.error(
            `Unexpected result format for UID: ${uids[uidIndex]} and account: ${applications[appIndex].account}`,
            permissionResult
          );
          return null;
        }

        return {
          uid: uids[uidIndex],
          account: applications[appIndex].account,
          applicationName: applications[appIndex].name,
          hasPermission: permissionResult.result as boolean,
        };
      })
      .filter(Boolean) || [];

  console.log({ permissionsWithUidsAndApps });

  // const { data: hasPermission } = useReadContract({
  //   abi: sepoliaChainOidonctract.oidContractAbi,
  //   address: sepoliaChainOidonctract.oidContractAddress as Address,
  //   functionName: 'hasPermission',
  //   args: [uid, account],
  // });

  // useEffect(() => {
  //   if (!isConnected) throw new Error('Wallet not connected');

  //   console.log({ hasPermission });
  // }, [hasPermission]);

  useEffect(() => {
    if (isConnected && signer && chainId && litNodeClient) {
      createSessionSigs({ signer, chainId, litNodeClient });
    }
  }, [signer, isConnected, litNodeClient, chainId, createSessionSigs]);

  const fetchAttestations = async () => {
    if (!address) throw new Error('No address found');

    const attestations = await getAttestations(address as `0x${string}`);

    const filteredUids = attestations
      .filter((attestation) => attestation.revocationTime === 0n)
      .map((attestation) => attestation.uid);

    setUids(filteredUids);

    return attestations.filter(
      (attestation) => attestation.revocationTime === 0n
    );
  };

  useEffect(() => {
    const decrypt = async () => {
      try {
        if (!sessionSigs || !litNodeClient)
          throw new Error('No sessionSigs found');

        const attestations = await fetchAttestations();

        const decryptedProviders = (await Promise.all(
          attestations.map((attestation) =>
            decryptAttestation(litNodeClient, attestation, sessionSigs)
              .then((result) => ({
                ...result,
                uid: attestation.uid,
              }))
              .catch(() => null)
          )
        ).then((results) =>
          results.filter((value) => value !== null)
        )) as IProvider[];

        setProviders(decryptedProviders);
      } catch (e) {
        console.log(e);
      }
    };

    decrypt();
  }, [sessionSigs, litNodeClient]);

  console.log({ providers });

  return (
    <div>
      <div>Permissions</div>
      <CustomTable
        xcolumns={providers}
        ycolumns={permissionsWithUidsAndApps}
        handleGrantOrRevokeAccess={(application, platform) => {
          writeContract({
            abi: sepoliaChainOidonctract.oidContractAbi as Abi,
            address: sepoliaChainOidonctract.oidContractAddress as Address,
            functionName: application.hasPermission
              ? 'revokePermission'
              : 'grantPermission',
            args: [platform.uid, application.account],
          });
        }}
      />
    </div>
  );
}
