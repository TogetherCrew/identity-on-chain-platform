import React from 'react';
import {
  Box,
  Button,
  CircularProgress,
  Stack,
  Typography,
} from '@mui/material';
import { FaLink } from 'react-icons/fa6';

import { Provider } from '../../../enums';
import { AttestPayload } from '../../../interfaces';
import { useLinkIdentifierMutation } from '../../../services/api/eas/query';
import { capitalize, getTokenForProvider } from '../../../utils/helper';

interface StepTwoProps {
  provider: Provider | undefined;
  handlePrepareAttestation: (payload: AttestPayload) => void;
}

const StepTwo: React.FC<StepTwoProps> = ({
  provider,
  handlePrepareAttestation,
}) => {
  const { mutate: mutateIdentifier, isPending } = useLinkIdentifierMutation();

  const handleGenerateSignedDelegation = async () => {
    const siweJwt = localStorage.getItem('OCI_TOKEN');
    if (!siweJwt || !provider) return;

    const anyJwt = getTokenForProvider(provider);

    mutateIdentifier(
      {
        siweJwt,
        anyJwt,
      },
      {
        onSuccess: (response) => {
          const { data } = response;
          handlePrepareAttestation(data);
        },
        onError: (error) => {
          console.error(error);
        },
      }
    );
  };

  if (!provider) {
    return null;
  }

  return (
    <Stack
      spacing={3}
      sx={{
        textAlign: 'center',
        py: 12,
        px: 2,
      }}
    >
      <Typography variant="h5" fontWeight="bold">
        Connect Your {capitalize(provider)} Account to Your Wallet
      </Typography>
      <Typography>
        To proceed, please verify your account by linking it to your wallet
        address. This step ensures your {capitalize(provider)} account is
        securely associated with your wallet.
      </Typography>
      <Box>
        <Button
          variant="contained"
          startIcon={
            isPending ? (
              <CircularProgress color="inherit" size={20} />
            ) : (
              <FaLink />
            )
          }
          sx={{ mt: 2, px: 4 }}
          onClick={handleGenerateSignedDelegation}
          disabled={isPending}
        >
          {isPending ? 'Processing...' : 'Get Signed Delegated Attestation'}
        </Button>
      </Box>
    </Stack>
  );
};

export default StepTwo;
