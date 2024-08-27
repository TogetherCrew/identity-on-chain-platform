/* eslint-disable react/no-array-index-key */
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
import { useEffect, useState } from 'react';
import {
  decryptAttestation,
  getAttestation,
  getAttestationIds,
  getAttestations,
  getAttestationsData,
  hasActiveRevocationTime,
  IAttestation,
} from '../../libs/oci';
import { useAccount } from 'wagmi';
import useLit from '../../hooks/LitProvider';
import useSessionSigs from '../../hooks/useSessionSigs';
import { useSigner } from '../../utils/eas-wagmi-utils';

const identifiers = [
  { name: 'Discord', icon: FaDiscord, verified: false, color: 'text-blue-500' },
  { name: 'Google', icon: FaGoogle, verified: false, color: 'text-red-500' },
];

export function Identifiers() {
  const { litNodeClient } = useLit();
  const { chainId } = useAccount();
  const { sessionSigs, createSessionSigs } = useSessionSigs();
  const [decryptedData, setDecryptedData] = useState<any | null>(null);

  const signer = useSigner();
  const { isConnected, address } = useAccount();
  const navigate = useNavigate();

  const handleRevoke = (identifier: string) => {
    console.log(`Revoke attestation for ${identifier}`);
  };

  const handleConnect = (identifier: string) => {
    console.log(`Connect identifier for ${identifier}`);
    navigate(`/identifiers/${identifier.toLowerCase()}/attestation`);
  };

  const fetchAttestations = async () => {
    if (!address) throw new Error('No address found');

    const attestations = await getAttestations(address as `0x${string}`);
    console.log({ attestations });

    return attestations;
  };

  useEffect(() => {
    if (isConnected && signer && chainId && litNodeClient) {
      console.log(litNodeClient, 'litNodeClient');

      createSessionSigs({ signer, chainId, litNodeClient });
    }
  }, [signer, isConnected, litNodeClient, chainId, createSessionSigs]);

  useEffect(() => {
    if (!sessionSigs) return;
    const decrypt = async () => {
      if (!sessionSigs) throw new Error('No sessionSigs found');

      const attestations = await fetchAttestations();

      const decryptedSecrets = Promise.all(
        attestations.map(async (attestation) => {
          return decryptAttestation(litNodeClient, attestation, sessionSigs);
        })
      );
      setDecryptedData(decryptedSecrets);
    };

    decrypt();
  }, [sessionSigs]);

  return (
    <div>
      <Typography variant="h6" gutterBottom>
        Identifiers
      </Typography>
      <List>
        <ListItem>
          <ListItemText primary="Identifier" />
          <ListItemSecondaryAction>
            <Typography variant="body2" style={{ marginRight: 40 }}>
              Actions
            </Typography>
          </ListItemSecondaryAction>
        </ListItem>
        <Divider />
        {identifiers.map((identifier, index) => (
          <Box key={index} mb={2}>
            <Paper elevation={1} className="rounded-xl py-2">
              <ListItem>
                <Avatar>
                  <identifier.icon
                    size={28}
                    className={`${identifier.verified ? 'text-black' : 'text-white'}`}
                  />
                </Avatar>
                <ListItemText
                  primary={
                    <div className="flex items-center">
                      {identifier.verified && (
                        <VerifiedIcon className="text-blue-400 mr-2" />
                      )}
                      {identifier.name}
                    </div>
                  }
                  style={{ marginLeft: 16 }}
                />
                <ListItemSecondaryAction>
                  {identifier.verified ? (
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => handleRevoke(identifier.name)}
                    >
                      Revoke
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleConnect(identifier.name)}
                    >
                      Connect
                    </Button>
                  )}
                </ListItemSecondaryAction>
              </ListItem>
            </Paper>
          </Box>
        ))}
      </List>
    </div>
  );
}

export default Identifiers;
