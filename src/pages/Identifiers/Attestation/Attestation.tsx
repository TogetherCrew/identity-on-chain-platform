import { useState } from 'react';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { useParams } from 'react-router-dom';
import StepperComponent from '../../../components/shared/CustomStepper';
import { platformAuthentication } from '../../../services/api/auth';

const steps = [{ label: 'Auth' }, { label: 'Attest' }, { label: 'Transact' }];

export function Attestation() {
  const { provider } = useParams<{ provider: 'DISCORD' | 'GOOGLE' }>();

  const [activeStep, setActiveStep] = useState(0);

  const handleAuthorize = () => {
    if (!provider) return;
    platformAuthentication({ platformType: provider });
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) =>
      Math.min(prevActiveStep + 1, steps.length - 1)
    );
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
              An attestation is a proof that links your Discord account to your
              wallet address.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={handleNext}
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
              onClick={handleNext}
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
