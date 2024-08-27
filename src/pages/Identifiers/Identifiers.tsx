import React, { useEffect, useState, useCallback } from 'react';
import {
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Button,
  Typography,
  Divider,
  Paper,
  Box,
  Avatar,
  CircularProgress,
} from '@mui/material';
import VerifiedIcon from '@mui/icons-material/Verified';
import { FaDiscord, FaGoogle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import {
  DelegatedRevocationRequest,
  EAS,
} from '@ethereum-attestation-service/eas-sdk';
import { Address } from 'viem';
import { useAccount } from 'wagmi';
import { useGetAttestations } from '../../services/eas/query';
import { decodeAttestationData, IAttestation } from '../../libs/oci';
import sepoliaChain from '../../utils/contracts/eas/sepoliaChain.json';
import { useSigner } from '../../utils/eas-wagmi-utils';
import { useRevokeIdentifierMutation } from '../../services/api/linking/query';
import { AttestPayload } from '../../interfaces';
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
}

const IdentifierItem: React.FC<IdentifierItemProps> = ({
  identifier,
  onRevoke,
  onConnect,
  isLoading,
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
                <VerifiedIcon sx={{ color: 'blue', mr: 2 }} />
              )}
              {identifier.name}
            </div>
          }
          sx={{ ml: 2 }}
        />
        <ListItemSecondaryAction>
          {identifier.verified ? (
            <Button
              variant="outlined"
              color="error"
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
  const { chainId } = useAccount();
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
  const { data: attestationsResponse, refetch } = useGetAttestations();

  const { mutate: mutateRevokeIdentifier, data: revokeIdentifierResponse } =
    useRevokeIdentifierMutation();

  const [loadingIdentifier, setLoadingIdentifier] = useState<boolean>(false);

  useEffect(() => {
    if (!attestationsResponse) throw new Error('No attestations found');

    const attestationsData = attestationsResponse.map((attestation) => {
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

    setAttestations(attestationsData);
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
  }, [attestations]);

  const navigate = useNavigate();

  const handleRevoke = useCallback(
    (uid: string) => {
      const siweJwt = localStorage.getItem('OCI_TOKEN');

      if (!siweJwt) throw new Error('OCI SIWE token not found');

      setLoadingIdentifier(true);

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
      console.log(`Connect identifier for ${identifier}`);
      navigate(`/identifiers/${identifier.toLowerCase()}/attestation`);
    },
    [navigate]
  );

  useEffect(() => {
    const revokeIdentifier = async () => {
      if (revokeIdentifierResponse) {
        console.log('Revoke identifier response', revokeIdentifierResponse);

        const payload: AttestPayload = convertStringsToBigInts(
          revokeIdentifierResponse.data
        ) as AttestPayload;

        console.log('Payload:', payload);

        try {
          const eas = new EAS(sepoliaChain.easContractAddress as Address);

          if (!signer) throw new Error('Signer not found');

          if (!revokeIdentifierResponse)
            throw new Error('No linking identifier');

          eas.connect(signer);

          const transformedPayload: DelegatedRevocationRequest = {
            schema: payload?.message?.schema,
            data: {
              uid: payload?.message?.uid,
            },
            signature: payload.signature,
            revoker: payload.message.revoker,
            deadline: 0n,
          };

          const tx = await eas.revokeByDelegation(transformedPayload);

          await tx.wait();
        } finally {
          setLoadingIdentifier(false);
          refetch();
        }
      }
    };

    revokeIdentifier();
  }, [revokeIdentifierResponse, refetch, signer]);

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
            isLoading={loadingIdentifier}
          />
        ))}
      </List>
    </div>
  );
}

export default Identifiers;
