/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useState } from 'react';
import { useReadContract, useReadContracts, useWriteContract } from 'wagmi';
import { Address, Abi } from 'viem';
import { Backdrop, CircularProgress, Stack, Typography } from '@mui/material';
import { useGetAttestations } from '../../services/eas/query';
import sepoliaChainAppConctract from '../../utils/contracts/app/sepoliaChain.json';
import sepoliaChainOidonctract from '../../utils/contracts/oid/sepoliaChain.json';
import { decodeAttestationData, IAttestation } from '../../libs/oci';
import CustomTable, {
  Platform,
  AccessData,
} from '../../components/shared/CustomTable';

export function Permissions() {
  const { writeContract, isPending: isWriting } = useWriteContract();
  const { data: attestationsResponse, isLoading: isLoadingAttestations } =
    useGetAttestations();
  const [applicationsArgs] = useState<[number, number]>([0, 10]);
  const [attestations, setAttestations] = useState<
    (IAttestation & { provider?: string; id?: string })[]
  >([]);
  const [permissionsWithUidsAndApps, setPermissionsWithUidsAndApps] = useState<
    AccessData[]
  >([]);

  const { data: applications, isLoading: isLoadingApplications } =
    useReadContract({
      abi: sepoliaChainAppConctract.appContractABI,
      address: sepoliaChainAppConctract.appContractAddress as Address,
      functionName: 'getApplications',
      args: applicationsArgs,
    });

  useEffect(() => {
    const processAttestations = () => {
      if (!attestationsResponse) {
        return;
      }

      const attestationsData = attestationsResponse.map((attestation) => {
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

      setAttestations(attestationsData);
    };

    processAttestations();
  }, [attestationsResponse]);

  const contractCalls = useMemo(
    () =>
      attestations.flatMap(
        (attestation) =>
          applications?.map((application) => ({
            abi: sepoliaChainOidonctract.oidContractAbi as Abi,
            address: sepoliaChainOidonctract.oidContractAddress as Address,
            functionName: 'hasPermission',
            args: [attestation.id, application.account],
          })) || []
      ),
    [attestations, applications]
  );

  const { data: hasPermissionsOnApp, isLoading: isLoadingPermissions } =
    useReadContracts({
      contracts: contractCalls,
    });

  useEffect(() => {
    if (hasPermissionsOnApp) {
      const uids = attestations.map((attestation) => attestation.id);

      const permissions =
        hasPermissionsOnApp
          ?.map((permissionResult, index) => {
            const uidIndex = Math.floor(index / applications.length);
            const appIndex = index % applications.length;

            if (
              !permissionResult ||
              typeof permissionResult.result !== 'boolean'
            ) {
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

      setPermissionsWithUidsAndApps(permissions);
    }
  }, [hasPermissionsOnApp, attestations, applications]);

  const providers: Platform[] = attestations.map((attestation) => ({
    id: attestation.id,
    provider: attestation.provider || 'Unknown',
    uid: attestation.id,
  }));

  const handleGrantOrRevokeAccess = (application: any, platform: any) => {
    writeContract({
      abi: sepoliaChainOidonctract.oidContractAbi as Abi,
      address: sepoliaChainOidonctract.oidContractAddress as Address,
      functionName: application.hasPermission
        ? 'revokePermission'
        : 'grantPermission',
      args: [platform.uid, application.account],
    });
  };

  const isLoading =
    isWriting ||
    isLoadingAttestations ||
    isLoadingApplications ||
    isLoadingPermissions;

  return (
    <div>
      <Backdrop
        open={isLoading}
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          background: '#fff',
          color: 'black',
        }}
      >
        <Stack
          sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <CircularProgress color="inherit" />
          <Typography variant="h6" gutterBottom style={{ marginLeft: '15px' }}>
            Loading...
          </Typography>
        </Stack>
      </Backdrop>
      <Typography variant="h6" gutterBottom>
        Permissions
      </Typography>
      <CustomTable
        xcolumns={providers}
        ycolumns={permissionsWithUidsAndApps}
        handleGrantOrRevokeAccess={handleGrantOrRevokeAccess}
      />
    </div>
  );
}
