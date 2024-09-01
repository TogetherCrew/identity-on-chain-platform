import '@testing-library/jest-dom';

import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import { Provider } from '../../../enums';

import StepOne from './StepOne';

describe('StepOne Component', () => {
  it('renders the component with the correct provider', () => {
    render(
      <MemoryRouter>
        <StepOne provider={Provider.Google} handleNextStep={() => {}} />
      </MemoryRouter>
    );

    expect(screen.getByText('Let’s get started!')).toBeInTheDocument();
    expect(
      screen.getByText('Please authenticate with Google to continue.')
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Authorize with Google/i })
    ).toBeInTheDocument();
  });
});
