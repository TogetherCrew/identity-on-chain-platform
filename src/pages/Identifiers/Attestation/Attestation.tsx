/* eslint-disable @typescript-eslint/no-shadow */
import { useState, useEffect } from 'react';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { Address } from 'viem';
import { useWriteContract, useAccount } from 'wagmi';
import StepperComponent from '../../../components/shared/CustomStepper';
import { platformAuthentication } from '../../../services/api/auth';
import { useLinkIdentifierMutation } from '../../../services/api/linking/query';
import { SUPPORTED_CHAINS } from '../../../contracts/chains/constants';

const steps = [{ label: 'Auth' }, { label: 'Attest' }, { label: 'Transact' }];

type Provider = 'DISCORD' | 'GOOGLE';
type Token = { token: string; exp: number; provider: Provider };
type DecodedToken = { provider: Provider; iat: number; exp: number };

export function Attestation() {
  const { isConnected, address } = useAccount();
  const { writeContract, error } = useWriteContract();

  useEffect(() => {
    if (!isConnected) {
      console.error('Not connected');
    }
  }, [isConnected, address]);

  const { provider } = useParams<{ provider: 'DISCORD' | 'GOOGLE' }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { mutate: mutateIdentifier, data: linkingIdentifier } =
    useLinkIdentifierMutation();
  const [activeStep, setActiveStep] = useState(0);
  const [linkingIdentifierRequest, setLinkingIdentifierRequest] = useState({});

  const handleNext = () => {
    setActiveStep((prevActiveStep) =>
      Math.min(prevActiveStep + 1, steps.length - 1)
    );
  };

  useEffect(() => {
    if (linkingIdentifier) {
      setLinkingIdentifierRequest(linkingIdentifier.data);
      handleNext();
    }
  }, [linkingIdentifier]);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const jwtToken = searchParams.get('jwt');

    if (jwtToken) {
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

        setActiveStep(1);
      } catch (error) {
        console.error('Invalid JWT token:', error);
      }
    }
  }, [location.search, location.pathname, navigate]);

  const handleAuthorize = () => {
    if (!provider) return;
    platformAuthentication({ platformType: provider });
  };

  const getTokenForProvider = (jwtProvider: string) => {
    const tokens =
      JSON.parse(localStorage.getItem('OCI_PROVIDER_TOKENS') || '') || [];
    const tokenObject = tokens.find(
      (token: { provider: string }) =>
        token.provider.toLowerCase() === jwtProvider.toLowerCase()
    );
    return tokenObject ? tokenObject.token : null;
  };

  const handleAttest = () => {
    writeContract({
      abi: SUPPORTED_CHAINS[0].easContractAbi,
      address: SUPPORTED_CHAINS[0].easContractAddress as Address,
      functionName: 'attestByDelegation',
      args: [linkingIdentifierRequest],
    });

    console.log({ error });
  };

  const handleLinkIdentifier = async () => {
    const siweJwt = localStorage.getItem('OCI_TOKEN');
    if (!siweJwt || !provider) return;
    const anyJwt = getTokenForProvider(provider);
    mutateIdentifier({
      siweJwt,
      anyJwt,
    });
  };

  return (
    <Paper
      className="p-12"
      sx={{
        height: 'calc(100vh - 100px)',
      }}
      variant="elevation"
      elevation={0}
    >
      <StepperComponent steps={steps} activeStep={activeStep} />
      <div className="relative flex justify-center text-center mt-4 top-[12rem]">
        {activeStep === 0 && (
          <div className="flex flex-col items-center space-y-3">
            <Typography variant="h6" fontWeight="bold" color="initial">
              Let’s get started!
            </Typography>
            <Typography variant="body1" color="GrayText">
              Please sign in with {provider}.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={handleAuthorize}
              className="mt-2"
            >
              Sign in with {provider}
            </Button>
          </div>
        )}
        {activeStep === 1 && (
          <div className="flex flex-col items-center space-y-3">
            <Typography variant="h6" fontWeight="bold" color="initial">
              Generate an attestation.
            </Typography>
            <Typography variant="body1" color="GrayText">
              An attestation is a proof that links your {provider} account to
              your wallet address.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={handleLinkIdentifier}
              className="mt-2"
            >
              Create attestation
            </Button>
          </div>
        )}
        {activeStep === 2 && (
          <div className="flex flex-col items-center space-y-3">
            <Typography variant="h6" fontWeight="bold" color="initial">
              Sign Transaction.
            </Typography>
            <Typography variant="body1" color="GrayText">
              Signing the transaction will put your attestation on-chain.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={handleAttest}
              className="mt-2"
            >
              Sign Transaction
            </Button>
            <Typography variant="body2" color="GrayText" className="mt-2">
              This will cost a small amount of gas.
            </Typography>
          </div>
        )}
      </div>
    </Paper>
  );
}

export default Attestation;
