import { Box, Button, Stack, Typography } from '@mui/material';
import { jwtDecode } from 'jwt-decode';
import { FaDiscourse } from 'react-icons/fa';

import { useGenerateDiscourseVerificationTokenMutation } from '../../../../services/api/eas/query';
import useSnackbarStore from '../../../../store/useSnackbarStore';

interface DiscourseStepOneProps {
  handleNextStep: () => void;
}

const DiscourseStepOne: React.FC<DiscourseStepOneProps> = ({
  handleNextStep,
}) => {
  const { showSnackbar } = useSnackbarStore();
  const { mutate: mutateGenerateDiscourseVerificationToken, isPending } =
    useGenerateDiscourseVerificationTokenMutation();

  const handleGenerateDiscourseVerificationToken = async () => {
    const siweJwt = localStorage.getItem('OCI_TOKEN') as string;

    mutateGenerateDiscourseVerificationToken(
      {
        siweJwt,
      },
      {
        onSuccess: (response) => {
          const { data } = response;

          localStorage.setItem(
            'DISCOURSE_VERIFICATION_TOKEN',
            data.verificationJwt
          );

          const { code } = jwtDecode(data.verificationJwt) as { code: string };
          localStorage.setItem('DISCOURSE_VERIFICATION_CODE', code);

          handleNextStep();
        },
        onError: (error) => {
          console.error('Failed to generate token:', error);
          showSnackbar(
            'Failed to generate verification token. Please try again.',
            {
              severity: 'error',
            }
          );
        },
      }
    );
  };

  return (
    <Stack
      spacing={2}
      sx={{
        textAlign: 'center',
        py: 12,
      }}
    >
      <Typography variant="h5" fontWeight="bold">
        Let&rsquo;s get started!
      </Typography>
      <Typography variant="body2">
        To attest your Discourse account, you need to generate a token.
      </Typography>
      <Box sx={{ display: 'block' }}>
        <Button
          variant="contained"
          startIcon={<FaDiscourse />}
          disabled={isPending}
          onClick={handleGenerateDiscourseVerificationToken}
          aria-busy={isPending}
          aria-live="polite"
        >
          {isPending ? 'Generating token...' : 'Generate token'}
        </Button>
      </Box>
    </Stack>
  );
};

export default DiscourseStepOne;
