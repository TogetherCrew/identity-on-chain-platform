import React from 'react';
import { Stepper, Step, StepLabel, StepIconProps, StepConnector, styled, stepConnectorClasses } from '@mui/material';
import Check from '@mui/icons-material/Check';

interface Step {
    label: string;
}

interface StepperComponentProps {
    steps: Step[];
    activeStep: number;
}

const CustomConnector = styled(StepConnector)(({ theme }) => ({
    [`&.${stepConnectorClasses.alternativeLabel}`]: {
        top: 22,
    },
    [`&.${stepConnectorClasses.active}`]: {
        [`& .${stepConnectorClasses.line}`]: {
            backgroundImage: 'linear-gradient( 95deg, #4200FF 0%, #4200FF 50%, #4200FF 100%)',
        },
    },
    [`&.${stepConnectorClasses.completed}`]: {
        [`& .${stepConnectorClasses.line}`]: {
            backgroundImage: 'linear-gradient( 95deg, #4200FF 0%, #4200FF 50%, #4200FF 100%)',
        },
    },
    [`& .${stepConnectorClasses.line}`]: {
        height: 3,
        border: 0,
        backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[800] : '#eaeaf0',
        borderRadius: 1,
    },
}));

const CustomStepIconRoot = styled('div')<{
    ownerState: { completed?: boolean; active?: boolean };
}>(({ theme, ownerState }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[700] : '#ccc',
    zIndex: 1,
    color: '#fff',
    width: 50,
    height: 50,
    display: 'flex',
    borderRadius: '50%',
    justifyContent: 'center',
    alignItems: 'center',
    ...(ownerState.active && {
        backgroundImage:
            'linear-gradient( 136deg, #4200FF 0%, #4200FF 50%, #4200FF 100%)',
        boxShadow: '0 4px 10px 0 rgba(0,0,0,.25)',
    }),
    ...(ownerState.completed && {
        backgroundImage:
            'linear-gradient( 136deg, #4200FF 0%, #4200FF 50%, #4200FF 100%)',
    }),
}));

function CustomStepIcon(props: StepIconProps) {
    const { active, completed, className } = props;

    return (
        <CustomStepIconRoot ownerState={{ completed, active }} className={className}>
            {completed ? <Check /> : <div>{props.icon}</div>}
        </CustomStepIconRoot>
    );
}

const StepperComponent: React.FC<StepperComponentProps> = ({ steps, activeStep }) => {
    return (
        <Stepper alternativeLabel activeStep={activeStep} connector={<CustomConnector />}>
            {steps.map((step, index) => (
                <Step key={index}>
                    <StepLabel StepIconComponent={CustomStepIcon}>{step.label}</StepLabel>
                </Step>
            ))}
        </Stepper>
    );
};

export default StepperComponent;
