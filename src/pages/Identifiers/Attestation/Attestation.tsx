import { useState, useEffect } from 'react';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { Address } from 'viem';
import { useAccount } from 'wagmi';
import {
  DelegatedAttestationRequest,
  EAS,
} from '@ethereum-attestation-service/eas-sdk';
import StepperComponent from '../../../components/shared/CustomStepper';
import { platformAuthentication } from '../../../services/api/auth';
import { useLinkIdentifierMutation } from '../../../services/api/linking/query';
import sepoliaChain from '../../../utils/contracts/eas/sepoliaChain.json';
import { useSigner } from '../../../utils/eas-wagmi-utils';
import { AttestPayload } from '../../../interfaces';
import {
  convertStringsToBigInts,
  getTokenForProvider,
} from '../../../utils/helper';

const steps = [{ label: 'Auth' }, { label: 'Attest' }, { label: 'Transact' }];

type Provider = 'DISCORD' | 'GOOGLE';
type Token = { token: string; exp: number; provider: Provider };
type DecodedToken = { provider: Provider; iat: number; exp: number };

export function Attestation() {
  const { isConnected, address } = useAccount();
  const signer = useSigner();

  const { providers } = useParams<{ providers: 'DISCORD' | 'GOOGLE' }>();
  const location = useLocation();
  const navigate = useNavigate();
  const {
    mutate: mutateIdentifier,
    data: linkingIdentifier,
    isPending,
  } = useLinkIdentifierMutation();

  const [activeStep, setActiveStep] = useState(0);
  const [linkingIdentifierRequest, setLinkingIdentifierRequest] =
    useState<AttestPayload | null>(null);

  const [isAuthorizing, setIsAuthorizing] = useState(false);
  const [isAttesting, setIsAttesting] = useState(false);

  useEffect(() => {
    if (!isConnected) {
      console.error('Not connected');
    }
  }, [isConnected, address]);

  const handleNext = () => {
    setActiveStep((prevActiveStep) =>
      Math.min(prevActiveStep + 1, steps.length - 1)
    );
  };

  useEffect(() => {
    if (linkingIdentifier) {
      const payload: AttestPayload = convertStringsToBigInts(
        linkingIdentifier.data
      ) as AttestPayload;

      setLinkingIdentifierRequest(payload);
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

  const handleAuthorize = async () => {
    if (!providers) return;

    setIsAuthorizing(true);
    try {
      await platformAuthentication({ platformType: providers });
    } finally {
      setIsAuthorizing(false);
    }
  };

  const handleAttest = async () => {
    setIsAttesting(true);
    try {
      const eas = new EAS(sepoliaChain.easContractAddress as Address);

      if (!signer) throw new Error('Signer not found');

      if (!linkingIdentifierRequest) throw new Error('No linking identifier');

      eas.connect(signer);

      const transformedPayload: DelegatedAttestationRequest = {
        schema: linkingIdentifierRequest?.message?.schema,
        data: {
          recipient: linkingIdentifierRequest.message.recipient,
          expirationTime: linkingIdentifierRequest.message.expirationTime,
          revocable: linkingIdentifierRequest.message.revocable,
          refUID: linkingIdentifierRequest.message.refUID,
          data: linkingIdentifierRequest.message.data,
        },
        signature: linkingIdentifierRequest.signature,
        attester: linkingIdentifierRequest.message.attester,
        deadline: 0n,
      };
      console.log({ transformedPayload });

      const tx = await eas.attestByDelegation(transformedPayload);

      console.log({ tx });

      const newAttestationUID = await tx.wait();

      console.log('New attestation UID:', newAttestationUID);

      console.log('Transaction receipt:', tx.receipt);
    } finally {
      setIsAttesting(false);
    }
  };

  const handleLinkIdentifier = async () => {
    const siweJwt = localStorage.getItem('OCI_TOKEN');
    if (!siweJwt || !providers) return;

    const anyJwt = getTokenForProvider(providers);

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
              Please sign in with {providers}.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={handleAuthorize}
              className="mt-2"
              disabled={isAuthorizing}
            >
              {isAuthorizing ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                `Sign in with ${providers}`
              )}
            </Button>
          </div>
        )}
        {activeStep === 1 && (
          <div className="flex flex-col items-center space-y-3">
            <Typography variant="h6" fontWeight="bold" color="initial">
              Generate an attestation.
            </Typography>
            <Typography variant="body1" color="GrayText">
              An attestation is a proof that links your {providers} account to
              your wallet address.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={handleLinkIdentifier}
              className="mt-2"
              disabled={isPending}
            >
              {isPending ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                'Create attestation'
              )}
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
              disabled={isAttesting}
            >
              {isAttesting ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                'Sign Transaction'
              )}
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
