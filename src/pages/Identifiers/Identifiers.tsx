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
import { FaDiscord, FaGoogle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { Address } from 'viem';

import useAttestations from '../../hooks/useAttestations';
import { IAttestation, RevokePayload } from '../../interfaces';
import {
  useDecryptAttestationsSecretMutation,
  useRevokeIdentifierMutation,
} from '../../services/api/eas/query';
import EASService from '../../services/eas.service';
import sepoliaChain from '../../utils/contracts/eas/sepoliaChain.json';
import { useSigner } from '../../utils/eas-wagmi-utils';

interface Identifier {
  name: string;
  icon: React.ElementType;
  verified: boolean;
  uid: string;
  revealedSecret?: string;
}

export default function Identifiers() {
  const navigate = useNavigate();
  const [userIdentifiers, setUserIdentifiers] = useState<Identifier[]>([
    { name: 'Discord', icon: FaDiscord, verified: false, uid: '' },
    { name: 'Google', icon: FaGoogle, verified: false, uid: '' },
  ]);
  const [openTooltips, setOpenTooltips] = useState<{ [key: string]: boolean }>(
    {}
  );
  const [loading, setLoading] = useState<{ [key: string]: boolean }>({});

  const signer = useSigner();

  const easService = signer
    ? new EASService(sepoliaChain.easContractAddress as Address, signer)
    : null;

  const {
    attestations,
    isLoading: attestationsLoading,
    error,
    chainId,
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
    }
  }, [attestations]);

  const revokeDelegation = async (response: RevokePayload) => {
    if (!easService) {
      throw new Error('EAS service not initialized');
    }

    try {
      await easService.revokeByDelegation(response);
      console.log('Revocation successful:');
    } catch (error) {
      console.error('Error revoking identifier:', error);
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
            revokeDelegation(response.data as RevokePayload);
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
      console.log('Identifier:', identifier);

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
            console.log('Decrypted secret:', response);
            setUserIdentifiers((prev) =>
              prev.map((id) => {
                if (id.uid === identifier.uid) {
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
                            identifier.revealedSecret &&
                            `Account ID: ${identifier.revealedSecret}`
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
              >
                {identifier.verified ? 'Revoke' : 'Connect'}
              </Button>
            </ListItemSecondaryAction>
          </ListItem>
        </List>
      ))}
    </Box>
  );
}
