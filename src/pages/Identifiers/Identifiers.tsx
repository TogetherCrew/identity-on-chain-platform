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
} from '@mui/material';
import VerifiedIcon from '@mui/icons-material/Verified';
import { FaDiscord, FaGoogle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import { useGetAttestations } from '../../services/eas/query';
import { decodeAttestationData, IAttestation } from '../../libs/oci';

interface IdentifierItemProps {
  identifier: {
    name: string;
    icon: React.ElementType;
    verified: boolean;
  };
  onRevoke: (name: string) => void;
  onConnect: (name: string) => void;
}

const IdentifierItem: React.FC<IdentifierItemProps> = ({
  identifier,
  onRevoke,
  onConnect,
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
              onClick={() => onRevoke(identifier.name)}
            >
              Revoke
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
  const [identifiers, setIdentifiers] = useState([
    {
      name: 'Discord',
      icon: FaDiscord,
      verified: false,
    },
    { name: 'Google', icon: FaGoogle, verified: false },
  ]);

  const [attestations, setAttestations] = useState<
    (IAttestation & { provider?: string })[]
  >([]);
  const { data: attestationsResponse } = useGetAttestations();

  useEffect(() => {
    if (!attestationsResponse) {
      console.error('No attestations found');
      return;
    }

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
      };
    });

    setIdentifiers(updatedIdentifiers);
  }, [attestations]);

  const navigate = useNavigate();

  const handleRevoke = useCallback((identifier: string) => {
    console.log(`Revoke attestation for ${identifier}`);
  }, []);

  const handleConnect = useCallback(
    (identifier: string) => {
      console.log(`Connect identifier for ${identifier}`);
      navigate(`/identifiers/${identifier.toLowerCase()}/attestation`);
    },
    [navigate]
  );

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
          />
        ))}
      </List>
    </div>
  );
}

export default Identifiers;
