// AccessControlButton.test.tsx
import '@testing-library/jest-dom';

import { fireEvent, render, screen } from '@testing-library/react';
import { vi } from 'vitest';

import AccessControlButton from './AccessControlButton';

describe('AccessControlButton', () => {
  it('renders with "Grant Access" when hasAccess is false', () => {
    const handleToggleAccess = vi.fn();
    render(
      <AccessControlButton
        hasAccess={false}
        onToggleAccess={handleToggleAccess}
      />
    );

    const button = screen.getByRole('button', { name: /grant access/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('Grant Access');
    expect(button).toHaveClass('MuiButton-containedPrimary');
  });

  it('renders with "Revoke Access" when hasAccess is true', () => {
    const handleToggleAccess = vi.fn();
    render(
      <AccessControlButton hasAccess onToggleAccess={handleToggleAccess} />
    );

    const button = screen.getByRole('button', { name: /revoke access/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('Revoke Access');
    expect(button).toHaveClass('MuiButton-outlinedError');
  });

  it('calls onToggleAccess when button is clicked', () => {
    const handleToggleAccess = vi.fn();
    render(
      <AccessControlButton
        hasAccess={false}
        onToggleAccess={handleToggleAccess}
      />
    );

    const button = screen.getByRole('button', { name: /grant access/i });
    fireEvent.click(button);

    expect(handleToggleAccess).toHaveBeenCalledTimes(1);
  });
});
