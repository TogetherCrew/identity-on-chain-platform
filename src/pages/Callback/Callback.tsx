import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { Backdrop, CircularProgress } from '@mui/material';

interface DecodedJwt {
  exp: number;
  iat: number;
  provider: string;
  sub: string;
}

const useQueryParams = () => {
  const { search } = useLocation();
  return new URLSearchParams(search);
};

const isJwt = (token: string): boolean => {
  const jwtRegex = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/;
  return jwtRegex.test(token);
};

const getStoredTokens = (): Array<{
  token: string;
  exp: number;
  provider: string;
}> => {
  const storedTokens = localStorage.getItem('OCI_PROVIDER_TOKENS');
  return storedTokens ? JSON.parse(storedTokens) : [];
};

const storeTokens = (
  tokens: Array<{ token: string; exp: number; provider: string }>
) => {
  localStorage.setItem('OCI_PROVIDER_TOKENS', JSON.stringify(tokens));
  console.log('Stored OCI_PROVIDER_TOKENS in localStorage');
};

export function Callback() {
  const queryParams = useQueryParams();
  const jwt = queryParams.get('jwt');
  const navigate = useNavigate();

  useEffect(() => {
    if (jwt && isJwt(jwt)) {
      try {
        const decodedJwt: DecodedJwt = jwtDecode(jwt);
        const { provider, exp } = decodedJwt;

        // Retrieve existing tokens from localStorage
        const storedTokens = getStoredTokens();

        // Remove any existing token for the current provider
        const updatedTokens = storedTokens.filter(
          (token) => token.provider !== provider
        );

        // Add the new token
        updatedTokens.push({ token: jwt, exp, provider });

        // Store updated tokens back to localStorage
        storeTokens(updatedTokens);

        // Redirect to the current JWT provider route
        navigate(`/identifiers/${provider}/attestation?jwt=${jwt}`);
      } catch (error) {
        console.error('Invalid JWT:', error);
      }
    } else {
      console.error('No valid JWT found in query parameters');
    }
  }, [jwt, navigate]);

  return (
    <Backdrop open>
      <CircularProgress color="inherit" />
    </Backdrop>
  );
}

export default Callback;
