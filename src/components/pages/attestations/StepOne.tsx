import { useEffect, useRef, useState } from 'react';
import { Box, Button, Stack, Typography } from '@mui/material';
import { jwtDecode } from 'jwt-decode';
import { FaDiscord, FaGoogle } from 'react-icons/fa';
import { useLocation, useNavigate } from 'react-router-dom';

import { Provider } from '../../../enums';
import { platformAuthentication } from '../../../services/api/auth';
import { capitalize } from '../../../utils/helper';

type Token = { token: string; exp: number; provider: Provider };
type DecodedToken = { provider: Provider; iat: number; exp: number };

interface StepOneProps {
  provider: Provider | undefined;
  handleNextStep: () => void;
}

const StepOne: React.FC<StepOneProps> = ({ provider, handleNextStep }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isAuthorizing, setIsAuthorizing] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const hasHandledNextStep = useRef(false);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const jwtToken = searchParams.get('jwt');

    if (jwtToken && !hasHandledNextStep.current) {
      try {
        const decoded: DecodedToken = jwtDecode(jwtToken);
        const { provider: jwtProvider } = decoded;

        const existingTokens: Token[] = JSON.parse(
          localStorage.getItem('OCI_PROVIDER_TOKENS') || '[]'
        );
        const updatedTokens = existingTokens.filter(
          (token) => token.provider !== jwtProvider
        );

        updatedTokens.push({
          token: jwtToken,
          exp: decoded.exp,
          provider: jwtProvider,
        });
        localStorage.setItem(
          'OCI_PROVIDER_TOKENS',
          JSON.stringify(updatedTokens)
        );

        navigate(location.pathname, { replace: true });

        hasHandledNextStep.current = true;
        handleNextStep();
      } catch (error) {
        setAuthError('Failed to decode JWT token. Please try again.');
        console.error('Invalid JWT token:', error);
      }
    }
  }, [location.search, location.pathname, navigate, handleNextStep]);

  const handleAuthorizeWithProvider = async () => {
    if (!provider) throw new Error('Provider is not defined');

    setIsAuthorizing(true);
    try {
      platformAuthentication({ platformType: provider });
    } finally {
      setIsAuthorizing(false);
    }
  };

  if (!provider) {
    return null;
  }

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
      <Typography>
        Please authenticate with {capitalize(provider)} to continue.
      </Typography>
      <Box sx={{ display: 'block' }}>
        <Button
          variant="contained"
          startIcon={
            provider === Provider.Discord ? <FaDiscord /> : <FaGoogle />
          }
          disabled={isAuthorizing}
          onClick={handleAuthorizeWithProvider}
          aria-busy={isAuthorizing}
          aria-live="polite"
        >
          {isAuthorizing
            ? 'Authorizing...'
            : `Authorize with ${capitalize(provider)}`}
        </Button>
      </Box>
      <Typography variant="caption" mt={1}>
        We use {capitalize(provider)} to verify your identity.
      </Typography>
      {authError && (
        <Typography color="error" variant="caption" mt={2}>
          {authError}
        </Typography>
      )}
    </Stack>
  );
};

export default StepOne;
