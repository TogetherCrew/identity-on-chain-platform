import { useState } from 'react';
import { Alert, AlertTitle, Paper } from '@mui/material';
import { useParams } from 'react-router-dom';

import StepOne from '../../../components/pages/attestations/StepOne';
import StepThree from '../../../components/pages/attestations/StepThree';
import StepTwo from '../../../components/pages/attestations/StepTwo';
import CustomBreadcrumb from '../../../components/shared/CustomBreadcrumb';
import CustomStepper from '../../../components/shared/CustomStepper';
import { Provider } from '../../../enums';
import { AttestPayload } from '../../../interfaces';

const steps = [
  { label: 'Authenticate' },
  { label: 'Attest' },
  { label: 'Transact' },
];

export default function Attestation() {
  const [activeStep, setActiveStep] = useState<number>(0);
  const { provider } = useParams<{ provider: Provider }>();
  const [attestedSignutare, setAttestedSignature] =
    useState<AttestPayload | null>(null);

  const handleNextStep = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handlePrepareAttestation = (attested: AttestPayload) => {
    setAttestedSignature(attested);
    handleNextStep();
  };

  const breadcrumbs = [
    { label: 'Identifiers', href: '/identifiers' },
    { label: 'Attestation' },
  ];

  return (
    <>
      <CustomBreadcrumb breadcrumbs={breadcrumbs} className="pb-3" />
      <Paper
        sx={{
          height: 'calc(100vh - 140px)',
          p: 2,
          borderRadius: 4,
          backgroundColor: 'white',
          border: '1px solid rgba(0, 0, 0, 0.05)',
          boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.05)',
        }}
        variant="elevation"
        elevation={0}
      >
        <Alert severity="info" sx={{ mb: 4 }}>
          <AlertTitle>Link Your Social Media Accounts</AlertTitle>
          Attest your social media accounts by linking them to your wallet
          address. This allows you to prove ownership over these accounts.
        </Alert>
        <CustomStepper steps={steps} activeStep={activeStep} />

        {activeStep === 0 && (
          <StepOne provider={provider} handleNextStep={handleNextStep} />
        )}
        {activeStep === 1 && (
          <StepTwo
            provider={provider}
            handlePrepareAttestation={handlePrepareAttestation}
          />
        )}
        {activeStep === 2 && (
          <StepThree attestedSignutare={attestedSignutare} />
        )}
      </Paper>
    </>
  );
}
