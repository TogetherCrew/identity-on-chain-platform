/* eslint-disable @typescript-eslint/no-shadow */
import { useCallback, useEffect, useState } from 'react';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import VerifiedIcon from '@mui/icons-material/Verified';
import {
  Alert,
  AlertTitle,
  Avatar,
  Badge,
  Box,
  Button,
  CircularProgress,
  ClickAwayListener,
  IconButton,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  Tooltip,
  Typography,
} from '@mui/material';
import clsx from 'clsx';
import { FaDiscord, FaDiscourse, FaGoogle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { Address } from 'viem';
import { useAccount } from 'wagmi';

import useAttestations from '../../hooks/useAttestations';
import { IAttestation, RevokePayload } from '../../interfaces';
import {
  useDecryptAttestationsSecretMutation,
  useRevokeIdentifierMutation,
} from '../../services/api/eas/query';
import EASService from '../../services/eas.service';
import useSnackbarStore from '../../store/useSnackbarStore';
import { contracts } from '../../utils/contracts/eas/contracts';
import { useSigner } from '../../utils/eas-wagmi-utils';

interface IMetadata {
  baseURL: string;
  id: string;
}
interface Identifier {
  name: string;
  icon: React.ElementType;
  verified: boolean;
  uid: string;
  revealedSecret?: string | IMetadata;
}

export default function Identifiers() {
  const navigate = useNavigate();
  const { chainId: chainIdNetwork } = useAccount();
  const { showSnackbar } = useSnackbarStore();
  const [userIdentifiers, setUserIdentifiers] = useState<Identifier[]>([
    { name: 'Discord', icon: FaDiscord, verified: false, uid: '' },
    {
      name: 'Discourse',
      icon: FaDiscourse,
      verified: false,
      uid: '',
    },
    { name: 'Google', icon: FaGoogle, verified: false, uid: '' },
  ]);

  const [openTooltips, setOpenTooltips] = useState<{ [key: string]: boolean }>(
    {}
  );
  const [loading, setLoading] = useState<{ [key: string]: boolean }>({});
  const [revoking, setRevoking] = useState<{ [key: string]: boolean }>({});

  const signer = useSigner();

  const easContractAddress = contracts.find(
    (contract) => contract.chainId === chainIdNetwork
  )?.easContractAddress;

  const easService = signer
    ? new EASService(easContractAddress as Address, signer)
    : null;

  const {
    attestations,
    isLoading: attestationsLoading,
    error,
    chainId,
    refetch,
  } = useAttestations();
  const { mutate: mutateRevoke } = useRevokeIdentifierMutation();

  const { mutate: mutateDecryptAttestationsSecret } =
    useDecryptAttestationsSecretMutation();

  const matchIdentifiersWithAttestations = (
    identifiers: Identifier[],
    attestationList: IAttestation[]
  ): Identifier[] => {
    return identifiers.map((identifier) => {
      const matchingAttestation = attestationList.find(
        (attestation) =>
          attestation.provider?.toLowerCase() === identifier.name.toLowerCase()
      );

      return {
        ...identifier,
        verified: !!matchingAttestation,
        uid: matchingAttestation?.id || '',
      };
    });
  };

  useEffect(() => {
    if (attestations && attestations.length > 0) {
      const resolvedIdentifiers = matchIdentifiersWithAttestations(
        userIdentifiers,
        attestations
      );

      setUserIdentifiers(resolvedIdentifiers);
    } else {
      setUserIdentifiers((prev) =>
        prev.map((identifier) => ({ ...identifier, verified: false }))
      );
    }
  }, [attestations]);

  const revokeDelegation = async (response: RevokePayload, uid: string) => {
    if (!easService) {
      throw new Error('EAS service not initialized');
    }

    setRevoking((prev) => ({ ...prev, [uid]: true }));

    try {
      await easService.revokeByDelegation(response);

      showSnackbar('Attestation Revoke successfully completed.', {
        severity: 'success',
      });

      await new Promise((resolve) => {
        setTimeout(resolve, 2000);
      });

      await refetch();
    } catch (error) {
      console.error('Error revoking identifier:', error);
      showSnackbar(
        'Failed to complete the attestation revoke. Please try again.',
        {
          severity: 'error',
        }
      );
    } finally {
      setRevoking((prev) => ({ ...prev, [uid]: false }));
    }
  };

  const handleRevokeAttestation = useCallback(
    async (uid: string) => {
      if (!easService) {
        throw new Error('EAS service not initialized');
      }

      const siweJwt = localStorage.getItem('OCI_TOKEN');

      if (!siweJwt) throw new Error('OCI SIWE token not found');

      mutateRevoke(
        { uid, siweJwt, chainId },
        {
          onSuccess: (response) => {
            revokeDelegation(response.data as RevokePayload, uid);
          },
          onError: (error) => {
            console.error('Error revoking identifier:', error);
          },
        }
      );
    },
    [mutateRevoke, chainId, easService]
  );

  const handleReveal = useCallback(
    (identifier: Identifier) => {
      const siweJwt = localStorage.getItem('OCI_TOKEN');

      if (!siweJwt) throw new Error('OCI SIWE token not found');

      setLoading((prev) => ({ ...prev, [identifier.uid]: true }));

      if (identifier.revealedSecret) {
        setOpenTooltips((prev) => ({ ...prev, [identifier.uid]: true }));
        setLoading((prev) => ({ ...prev, [identifier.uid]: false }));
        return;
      }

      mutateDecryptAttestationsSecret(
        {
          uid: identifier.uid,
          siweJwt,
          chainId,
        },
        {
          onSuccess: (response) => {
            setUserIdentifiers((prev) =>
              prev.map((id) => {
                if (id.uid === identifier.uid) {
                  if (identifier.name === 'Discourse') {
                    return {
                      ...id,
                      revealedSecret: {
                        id: response.data.id,
                        baseURL: response.data.metadata.baseURL,
                      },
                    };
                  }

                  return {
                    ...id,
                    revealedSecret: response.data.id,
                  };
                }
                return id;
              })
            );
            setOpenTooltips((prev) => ({ ...prev, [identifier.uid]: true }));
          },
          onError: (error) => {
            console.error('Error decrypting secret:', error);
          },
          onSettled: () => {
            setLoading((prev) => ({ ...prev, [identifier.uid]: false }));
          },
        }
      );
    },
    [mutateDecryptAttestationsSecret, chainId]
  );

  const handleConnectAttestation = useCallback(
    (name: string) => {
      navigate(`/identifiers/${name.toLowerCase()}/attestation`);
    },
    [navigate]
  );

  const handleTooltipClose = (uid: string) => {
    setOpenTooltips((prev) => ({ ...prev, [uid]: false }));
  };

  const renderButtonContent = (identifier: Identifier) => {
    if (revoking[identifier.uid]) {
      return (
        <>
          <CircularProgress color="inherit" size={16} sx={{ mr: 1 }} />
          Revoking...
        </>
      );
    }

    return identifier.verified ? 'Revoke' : 'Connect';
  };

  const getRevealedSecret = (identifier: Identifier | null) => {
    if (!identifier) return 'No data available';

    if (identifier.name === 'Discourse' && identifier.revealedSecret) {
      if (typeof identifier.revealedSecret === 'object') {
        const { id, baseURL } = identifier.revealedSecret;
        return `Topic ID: ${id || 'N/A'} - Topic URL: ${baseURL || 'N/A'}`;
      }
    }

    if (identifier.revealedSecret) {
      return `Account ID: ${identifier.revealedSecret || 'N/A'}`;
    }

    return 'No data available';
  };

  if (attestationsLoading) {
    return <CircularProgress />;
  }

  if (error) {
    return (
      <Alert severity="error">
        <AlertTitle>Error</AlertTitle>
        An error occurred while fetching identifiers
      </Alert>
    );
  }

  return (
    <Box>
      <Typography variant="h6" fontWeight="bold">
        Identifiers
      </Typography>
      <Typography variant="body2" pb={2}>
        Connect your identifiers to start using the service.
      </Typography>

      {userIdentifiers.map((identifier) => (
        <List key={identifier.name}>
          <ListItem
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: 2,
              borderRadius: 4,
              backgroundColor: 'white',
              border: '1px solid rgba(0, 0, 0, 0.05)',
              boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.05)',
            }}
          >
            <Badge
              overlap="circular"
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              badgeContent={
                identifier.verified ? (
                  <VerifiedIcon sx={{ fontSize: 16, color: '#0ea5e9' }} />
                ) : null
              }
            >
              <Avatar>
                <identifier.icon
                  size={28}
                  className={clsx({
                    'text-black': identifier.verified,
                    'text-white': !identifier.verified,
                  })}
                />
              </Avatar>
            </Badge>
            <ListItemText>
              <div className="pl-3 flex items-center space-x-1">
                <span className="font-bold">{identifier.name}</span>
                {identifier.verified && (
                  <ClickAwayListener
                    onClickAway={() => handleTooltipClose(identifier.uid)}
                  >
                    <div>
                      <Tooltip
                        title={
                          loading[identifier.uid] ? (
                            <CircularProgress color="inherit" size={20} />
                          ) : (
                            `${getRevealedSecret(identifier)}`
                          )
                        }
                        arrow
                        open={openTooltips[identifier.uid] || false}
                        onClose={() => handleTooltipClose(identifier.uid)}
                        disableHoverListener
                        disableTouchListener
                        disableFocusListener
                        placement="top"
                      >
                        <IconButton
                          onClick={() => handleReveal(identifier)}
                          sx={{
                            ml: 1,
                            p: 0,
                          }}
                        >
                          {loading[identifier.uid] ? (
                            <CircularProgress color="inherit" size={20} />
                          ) : (
                            <ErrorOutlineIcon />
                          )}
                        </IconButton>
                      </Tooltip>
                    </div>
                  </ClickAwayListener>
                )}
              </div>
            </ListItemText>
            <ListItemSecondaryAction>
              <Button
                variant={identifier.verified ? 'outlined' : 'contained'}
                color={identifier.verified ? 'error' : 'primary'}
                onClick={
                  identifier.verified
                    ? () => handleRevokeAttestation(identifier.uid)
                    : () => handleConnectAttestation(identifier.name)
                }
                disabled={revoking[identifier.uid]}
              >
                {renderButtonContent(identifier)}
              </Button>
            </ListItemSecondaryAction>
          </ListItem>
        </List>
      ))}
    </Box>
  );
}
