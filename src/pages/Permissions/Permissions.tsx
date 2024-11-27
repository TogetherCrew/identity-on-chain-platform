/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Stack,
  Typography,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Abi, Address } from 'viem';
import {
  useAccount,
  useReadContract,
  useReadContracts,
  useWaitForTransactionReceipt,
  useWriteContract,
} from 'wagmi';

import CustomTable, {
  AccessData,
  Platform,
} from '../../components/shared/CustomTable';
import { IAttestation } from '../../interfaces';
import { decodeAttestationData } from '../../libs/oci';
import { useGetAttestations } from '../../services/eas/query';
import useSnackbarStore from '../../store/useSnackbarStore';
import { appContracts } from '../../utils/contracts/app/contracts';
import { oidContracts } from '../../utils/contracts/oid/contracts';

export function Permissions() {
  const { showSnackbar } = useSnackbarStore();
  const { address, chainId } = useAccount();
  const navigate = useNavigate();

  const appContract = appContracts.find(
    (contract) => contract.chainId === chainId
  );
  const oidContract = oidContracts.find(
    (contract) => contract.chainId === chainId
  );

  const {
    data: transactionHash,
    writeContract,
    isPending: isWriting,
  } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash: transactionHash,
    });

  const {
    data: attestationsResponse,
    isLoading: isLoadingAttestations,
    refetch: refetchAttestations,
  } = useGetAttestations(address as Address, chainId as number);

  const [applicationsArgs] = useState<[number, number]>([0, 10]);
  const [attestations, setAttestations] = useState<
    (IAttestation & { provider?: string; id?: string })[]
  >([]);
  const [permissionsWithUidsAndApps, setPermissionsWithUidsAndApps] = useState<
    AccessData[]
  >([]);

  const {
    data,
    isLoading: isLoadingApplications,
    error,
    refetch: refetchApplications,
  } = useReadContract({
    abi: appContract?.abi,
    address: appContract?.address as Address,
    functionName: 'getApplications',
    args: applicationsArgs,
  });

  if (error) {
    throw new Error('Error fetching applications');
  }

  const applications = useMemo(
    () => (data as { name: string; account: string }[]) || [],
    [data]
  );

  useEffect(() => {
    const processAttestations = () => {
      if (!attestationsResponse) {
        return;
      }

      const attestationsData = attestationsResponse.map((attestation) => {
        const decodedData = decodeAttestationData(attestation.data);

        const keyData = decodedData.find((field) => field.name === 'key');
        const provider = decodedData.find((field) => field.name === 'provider');

        return {
          ...attestation,
          provider:
            typeof provider?.value.value === 'string'
              ? provider.value.value
              : undefined,
          key:
            typeof keyData?.value.value === 'string'
              ? keyData.value.value
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
            abi: oidContract?.abi as Abi,
            address: oidContract?.address as Address,
            functionName: 'hasPermission',
            args: [attestation.key, application.account],
          })) || []
      ),
    [attestations, applications]
  );

  const {
    data: hasPermissionsOnApp,
    isLoading: isLoadingPermissions,
    refetch: refetchPermissions,
  } = useReadContracts({
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

      setPermissionsWithUidsAndApps(
        permissions.filter(
          (permission): permission is AccessData => permission !== null
        )
      );
    }
  }, [hasPermissionsOnApp, attestations, applications]);

  const providers: Platform[] = attestations.map((attestation) => ({
    id: attestation.id || 'Unknown',
    provider: attestation.provider || 'Unknown',
    uid: attestation.id || 'Unknown',
  }));

  const handleGrantOrRevokeAccess = (application: any, platform: any) => {
    writeContract(
      {
        abi: oidContract?.abi as Abi,
        address: oidContract?.address as Address,
        functionName: application.hasPermission
          ? 'revokePermission'
          : 'grantPermission',
        args: [platform.uid, application.account],
      },
      {
        // eslint-disable-next-line @typescript-eslint/no-shadow
        onError: (error: any) => {
          const errorCode = error.cause?.code || error.code;

          if (errorCode === 4001) {
            showSnackbar(
              `${errorCode}, you rejected the transaction. Please try again...`,
              {
                severity: 'error',
              }
            );
          } else {
            showSnackbar(`Transaction failed: ${error.message}`, {
              severity: 'error',
            });
          }
        },
      }
    );
  };

  useEffect(() => {
    if (isConfirmed) {
      refetchAttestations();
      refetchApplications();
      refetchPermissions();
    }
  }, [isConfirmed]);

  const isLoading =
    isWriting ||
    isLoadingAttestations ||
    isLoadingApplications ||
    isLoadingPermissions ||
    isConfirming;

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
      {!isLoading && providers.length === 0 ? (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            height: '80vh',
          }}
        >
          <Alert severity="warning" sx={{ mb: 2 }}>
            To be able to grant or revoke access to applications, you need to
            have at least one identifier.
          </Alert>
          <Button
            variant="contained"
            color="warning"
            onClick={() => {
              navigate('/identifiers');
            }}
          >
            Go to Identifiers
          </Button>
        </Box>
      ) : (
        <>
          <Typography variant="h6" gutterBottom>
            Permissions
          </Typography>
          <Alert severity="info" sx={{ mb: 2 }}>
            <b>Note</b>: The process of revoking or granting access to
            applications may take some time.
          </Alert>
          <CustomTable
            xcolumns={providers}
            ycolumns={permissionsWithUidsAndApps}
            handleGrantOrRevokeAccess={handleGrantOrRevokeAccess}
          />
        </>
      )}
    </div>
  );
}
