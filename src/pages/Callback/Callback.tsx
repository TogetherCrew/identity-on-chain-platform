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

const storeTokens = (
  tokens: Array<{ token: string; exp: number; provider: string }>
) => {
  localStorage.setItem('OCI_PROVIDER_TOKENS', JSON.stringify(tokens));
  console.log('Stored OCI_PROVIDER_TOKENS in localStorage');
};

export function Callback() {
  const queryParams = useQueryParams();
  const jwtArray = queryParams.getAll('jwt');
  const navigate = useNavigate();

  useEffect(() => {
    if (jwtArray.length > 0) {
      const storedTokens: Array<{
        token: string;
        exp: number;
        provider: string;
      }> = [];

      jwtArray.forEach((jwt) => {
        if (isJwt(jwt)) {
          try {
            const decodedJwt: DecodedJwt = jwtDecode(jwt);
            const { provider, exp } = decodedJwt;
            storedTokens.push({ token: jwt, exp, provider });

            // Redirect to the current JWT provider route
            navigate(`/identifiers/${provider}/attestation?jwt=${jwt}`);
          } catch (error) {
            console.error('Invalid JWT:', error);
          }
        } else {
          console.error('Invalid JWT format:', jwt);
        }
      });

      storeTokens(storedTokens);
    } else {
      console.error('No JWTs found in query parameters');
    }
  }, [jwtArray, navigate]);

  return (
    <Backdrop open>
      <CircularProgress color="inherit" />
    </Backdrop>
  );
}

export default Callback;
