/* eslint-disable react/destructuring-assignment */
import React from 'react';
import Check from '@mui/icons-material/Check';
import {
  Step,
  StepConnector,
  stepConnectorClasses,
  StepIconProps,
  StepLabel,
  Stepper,
  styled,
} from '@mui/material';

interface IStep {
  label: string;
}

interface StepperComponentProps {
  steps: IStep[];
  activeStep: number;
}

const gradientBackground = 'linear-gradient(136deg, #4200FF 0%, #4200FF 100%)';

const CustomConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 22,
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage: gradientBackground,
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage: gradientBackground,
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 3,
    border: 0,
    backgroundColor:
      theme.palette.mode === 'dark' ? theme.palette.grey[800] : '#eaeaf0',
    borderRadius: 1,
  },
}));

const CustomStepIconRoot = styled('div')<{
  ownerState: { completed?: boolean; active?: boolean };
}>(({ theme, ownerState }) => ({
  backgroundColor:
    theme.palette.mode === 'dark' ? theme.palette.grey[700] : '#ccc',
  zIndex: 1,
  color: '#fff',
  width: 50,
  height: 50,
  display: 'flex',
  borderRadius: '50%',
  justifyContent: 'center',
  alignItems: 'center',
  ...(ownerState.active && {
    backgroundImage: gradientBackground,
    boxShadow: '0 4px 10px 0 rgba(0,0,0,.25)',
  }),
  ...(ownerState.completed && {
    backgroundImage: gradientBackground,
  }),
}));

const CustomStepIcon: React.FC<StepIconProps> = ({
  active,
  completed,
  className,
  icon,
}) => (
  <CustomStepIconRoot ownerState={{ completed, active }} className={className}>
    {completed ? <Check /> : <div>{icon}</div>}
  </CustomStepIconRoot>
);

const StepperComponent: React.FC<StepperComponentProps> = ({
  steps,
  activeStep,
}) => (
  <Stepper
    alternativeLabel
    activeStep={activeStep}
    connector={<CustomConnector />}
  >
    {steps.map((step) => (
      <Step key={step.label}>
        <StepLabel StepIconComponent={CustomStepIcon}>{step.label}</StepLabel>
      </Step>
    ))}
  </Stepper>
);

export default React.memo(StepperComponent);
