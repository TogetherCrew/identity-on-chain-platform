import { useState } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  Stack,
  Typography,
} from '@mui/material';
import { FaLink } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { Address } from 'viem';
import { useAccount } from 'wagmi';

import { AttestPayload } from '../../../interfaces';
import EASService from '../../../services/eas.service';
import useSnackbarStore from '../../../store/useSnackbarStore';
import { contracts } from '../../../utils/contracts/eas/contracts';
import { useSigner } from '../../../utils/eas-wagmi-utils';

interface DiscourseStepFourProps {
  attestedSignutare: AttestPayload | null;
}

const DiscourseStepFour: React.FC<DiscourseStepFourProps> = ({
  attestedSignutare,
}) => {
  const { showSnackbar } = useSnackbarStore();
  const navigate = useNavigate();
  const signer = useSigner();
  const { chainId } = useAccount();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const easContractAddress = contracts.find(
    (contract) => contract.chainId === chainId
  )?.easContractAddress;

  const easService = signer
    ? new EASService(easContractAddress as Address, signer)
    : null;

  const handleAttestByDelegation = async () => {
    if (!easService) {
      throw new Error('EAS service not initialized');
    }
    if (!attestedSignutare) throw new Error('No attested signature provided');

    setIsLoading(true);
    try {
      await easService.attestByDelegation(attestedSignutare);
      showSnackbar('Attestation successfully completed.', {
        severity: 'success',
      });
      navigate('/identifiers');
    } catch (error) {
      console.error('Error attesting identifier:', error);
      showSnackbar('Failed to complete the attestation. Please try again.', {
        severity: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

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
        Finalize Delegated Attestation
      </Typography>
      <Typography>
        To complete the process, you will be asked to sign a message with your
        wallet, confirming ownership of the provided address.
      </Typography>
      <Box>
        <Button
          variant="contained"
          startIcon={
            isLoading ? (
              <CircularProgress color="inherit" size={20} />
            ) : (
              <FaLink />
            )
          }
          sx={{ mt: 2, px: 4 }}
          onClick={handleAttestByDelegation}
          disabled={isLoading}
        >
          {isLoading ? 'Processing...' : 'Sign Delegated Attestation'}
        </Button>
      </Box>
      <Typography variant="caption">
        You need to pay some <b>gas</b> to complete the process.
      </Typography>
    </Stack>
  );
};

export default DiscourseStepFour;
