/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useEffect, useState } from 'react';
import {
  DelegatedRevocationRequest,
  EAS,
} from '@ethereum-attestation-service/eas-sdk';
import VerifiedIcon from '@mui/icons-material/Verified';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import {
  Avatar,
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import clsx from 'clsx';
import { FaDiscord, FaGoogle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { Address } from 'viem';
import { useAccount } from 'wagmi';

import { RevokePayload } from '../../interfaces';
import { decodeAttestationData, IAttestation } from '../../libs/oci';
import {
  useDecryptAttestationsSecretMutation,
  useRevokeIdentifierMutation,
} from '../../services/api/eas/query';
import { useGetAttestations } from '../../services/eas/query';
import useSnackbarStore from '../../store/useSnackbarStore';
import sepoliaChain from '../../utils/contracts/eas/sepoliaChain.json';
import { useSigner } from '../../utils/eas-wagmi-utils';
import { convertStringsToBigInts } from '../../utils/helper';

interface IdentifierItemProps {
  identifier: {
    name: string;
    icon: React.ElementType;
    verified: boolean;
    uid: string;
  };
  onRevoke: (uid: string) => void;
  onConnect: (name: string) => void;
  isLoading: boolean;
  isRevealedPending: boolean;
  isRevealed: string;
  onReveal: () => void;
}

const IdentifierItem: React.FC<IdentifierItemProps> = ({
  identifier,
  onRevoke,
  onConnect,
  isLoading,
  isRevealedPending,
  isRevealed,
  onReveal,
}) => (
  <Box mb={2}>
    <Paper elevation={1} className="rounded-xl py-2">
      <ListItem>
        <Avatar>
          <identifier.icon
            size={28}
            className={clsx({
              'text-black': identifier.verified,
              'text-white': !identifier.verified,
            })}
          />
        </Avatar>
        <ListItemText
          primary={
            <div className="flex items-center">
              {identifier.verified && (
                <VerifiedIcon sx={{ color: 'blue', mr: 1 }} />
              )}
              <Typography>{identifier.name}</Typography>
              {identifier.verified && (
                <div className="ml-3">
                  {isRevealedPending ? (
                    <CircularProgress size={24} />
                  ) : (
                    <>
                      {isRevealed !== '*********' ? isRevealed : '*********'}
                      <IconButton onClick={onReveal} sx={{ ml: 1 }}>
                        {isRevealed !== '*********' ? (
                          <VisibilityOffIcon />
                        ) : (
                          <VisibilityIcon />
                        )}
                      </IconButton>
                    </>
                  )}
                </div>
              )}
            </div>
          }
          sx={{ ml: 2 }}
        />
        <ListItemSecondaryAction>
          {identifier.verified ? (
            <Button
              variant="outlined"
              color="inherit"
              onClick={() => onRevoke(identifier.uid)}
              disabled={isLoading}
              startIcon={isLoading ? <CircularProgress size={16} /> : null}
            >
              {isLoading ? 'Revoking...' : 'Revoke'}
            </Button>
          ) : (
            <Button
              variant="contained"
              color="primary"
              onClick={() => onConnect(identifier.name)}
            >
              Connect
            </Button>
          )}
        </ListItemSecondaryAction>
      </ListItem>
    </Paper>
  </Box>
);

export function Identifiers() {
  const { showSnackbar } = useSnackbarStore();
  const { chainId, address } = useAccount();
  const navigate = useNavigate();

  const signer = useSigner();

  const [identifiers, setIdentifiers] = useState([
    {
      name: 'Discord',
      icon: FaDiscord,
      verified: false,
      uid: '',
    },
    { name: 'Google', icon: FaGoogle, verified: false, uid: '' },
  ]);

  const [attestations, setAttestations] = useState<
    (IAttestation & { provider?: string; id?: string })[]
  >([]);
  const {
    data: attestationsResponse,
    refetch,
    isLoading,
  } = useGetAttestations(address as `0x${string}`);

  const { mutate: mutateRevokeIdentifier, data: revokeIdentifierResponse } =
    useRevokeIdentifierMutation();

  const { mutate: mutateDecryptAttestationsSecret } =
    useDecryptAttestationsSecretMutation();

  const [loadingIdentifiers, setLoadingIdentifiers] = useState<{
    [uid: string]: boolean;
  }>({});

  const [revealedIdentifiers, setRevealedIdentifiers] = useState<{
    [uid: string]: string;
  }>({});

  const [revealing, setRevealing] = useState<{ [uid: string]: boolean }>({});

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

  useEffect(() => {
    const updatedIdentifiers = identifiers.map((identifier) => {
      const matchingAttestation = attestations.find(
        (attestation) =>
          (attestation.provider as string)?.toLowerCase() ===
          identifier.name.toLowerCase()
      );

      return {
        ...identifier,
        verified: !!matchingAttestation,
        uid: matchingAttestation?.id || '',
      };
    });

    setIdentifiers(updatedIdentifiers);

    const initialRevealedState = updatedIdentifiers.reduce(
      (acc, identifier) => {
        acc[identifier.uid] = '*********';
        return acc;
      },
      {} as { [uid: string]: string }
    );

    setRevealedIdentifiers(initialRevealedState);
  }, [attestations]);

  const handleRevoke = useCallback(
    (uid: string) => {
      const siweJwt = localStorage.getItem('OCI_TOKEN');

      if (!siweJwt) throw new Error('OCI SIWE token not found');

      setLoadingIdentifiers((prev) => ({ ...prev, [uid]: true }));

      mutateRevokeIdentifier({
        uid,
        siweJwt,
        chainId,
      });
    },
    [mutateRevokeIdentifier, chainId]
  );

  const handleConnect = useCallback(
    (identifier: string) => {
      navigate(`/identifiers/${identifier.toLowerCase()}/attestation`);
    },
    [navigate]
  );

  const handleReveal = useCallback(
    (uid: string) => {
      // Toggle between showing and hiding the identifier
      if (revealedIdentifiers[uid] !== '*********') {
        setRevealedIdentifiers((prev) => ({
          ...prev,
          [uid]: '*********',
        }));
        return;
      }

      setRevealing((prev) => ({
        ...prev,
        [uid]: true,
      }));

      const siweJwt = localStorage.getItem('OCI_TOKEN');

      if (!siweJwt) throw new Error('OCI SIWE token not found');

      mutateDecryptAttestationsSecret(
        {
          uid,
          siweJwt,
          chainId,
        },
        {
          onSuccess: (response) => {
            console.log('Decrypted secret:', response);

            setRevealedIdentifiers((prev) => ({
              ...prev,
              [uid]: response.data.id,
            }));
            setRevealing((prev) => ({
              ...prev,
              [uid]: false,
            }));
          },
          onError: (error) => {
            console.error('Error decrypting secret:', error);
            setRevealing((prev) => ({
              ...prev,
              [uid]: false,
            }));
          },
        }
      );
    },
    [chainId, mutateDecryptAttestationsSecret, revealedIdentifiers]
  );

  useEffect(() => {
    const revokeIdentifier = async () => {
      if (revokeIdentifierResponse) {
        console.log('Revoke identifier response:', revokeIdentifierResponse);

        const payload: RevokePayload = convertStringsToBigInts(
          revokeIdentifierResponse.data
        ) as RevokePayload;

        console.log('Payload:', payload);

        try {
          const eas = new EAS(sepoliaChain.easContractAddress as Address);

          if (!signer) throw new Error('Signer not found');

          if (!revokeIdentifierResponse)
            throw new Error('No linking identifier');

          eas.connect(signer);

          if ('revoker' in payload.message) {
            const transformedPayload: DelegatedRevocationRequest = {
              schema: payload.message.schema,
              data: {
                uid: payload.message.uid,
              },
              signature: payload.signature,
              revoker: payload.message.revoker,
              deadline: 0n,
            };

            const tx = await eas.revokeByDelegation(transformedPayload);
            await tx.wait();
            console.log({ tx });

            showSnackbar('Identifier revoked successfully', {
              severity: 'success',
            });

            setLoadingIdentifiers((prev) => ({
              ...prev,
              [payload.message.uid]: false,
            }));
          } else {
            throw new Error('Invalid message type for revocation');
          }
        } catch (error: any) {
          const errorCode = error?.info?.error?.code || '';

          if (errorCode === 4001) {
            showSnackbar(
              `${errorCode}, you reject the transaction. please try again...`,
              {
                severity: 'error',
              }
            );
          }

          if ('uid' in payload.message) {
            setLoadingIdentifiers((prev) => ({
              ...prev,
              [payload.message.uid]: false,
            }));
          }
        } finally {
          refetch();
        }
      }
    };

    revokeIdentifier();
  }, [revokeIdentifierResponse]);

  if (isLoading) {
    return (
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
    );
  }

  return (
    <div>
      <Typography variant="h6" gutterBottom>
        Identifiers
      </Typography>
      <List>
        <ListItem>
          <ListItemText primary="Identifier" />
          <ListItemSecondaryAction>
            <Typography variant="body2" sx={{ marginRight: 5 }}>
              Actions
            </Typography>
          </ListItemSecondaryAction>
        </ListItem>
        <Divider />
        {identifiers.map((identifier) => (
          <IdentifierItem
            key={identifier.name}
            identifier={identifier}
            onRevoke={handleRevoke}
            onConnect={handleConnect}
            isLoading={loadingIdentifiers[identifier.uid] || false}
            isRevealedPending={revealing[identifier.uid] || false}
            isRevealed={revealedIdentifiers[identifier.uid] || '*********'}
            onReveal={() => handleReveal(identifier.uid)}
          />
        ))}
      </List>
    </div>
  );
}

export default Identifiers;
