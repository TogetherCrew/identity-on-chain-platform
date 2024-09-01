import '@testing-library/jest-dom';

import { render, screen } from '@testing-library/react';

import StepperComponent from './CustomStepper';

describe('StepperComponent', () => {
  const steps = [{ label: 'Auth' }, { label: 'Attest' }, { label: 'Transact' }];

  it('renders all step labels correctly', () => {
    render(<StepperComponent steps={steps} activeStep={0} />);

    steps.forEach((step) => {
      expect(screen.getByText(step.label)).toBeInTheDocument();
    });
  });

  it('highlights the active step correctly', () => {
    render(<StepperComponent steps={steps} activeStep={1} />);

    const activeStep = screen.getByText('Attest').closest('.MuiStep-root');
    expect(activeStep).toHaveClass('MuiStep-horizontal');
  });
});
