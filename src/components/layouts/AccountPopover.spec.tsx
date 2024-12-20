import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import AccountPopover from './AccountPopover';

describe('AccountPopover', () => {
  it('should render the AccountPopover component', () => {
    render(<AccountPopover />);

    const iconButton = screen.getByTestId('account-popover-button');
    expect(iconButton).toBeInTheDocument();
  });

  it('should open the popover when icon button is clicked', () => {
    render(<AccountPopover />);

    const iconButton = screen.getByTestId('account-popover-button');
    fireEvent.click(iconButton);

    const logoutMenuItem = screen.getByText('Logout');
    expect(logoutMenuItem).toBeVisible();
  });

  it('should log out the user when logout menu item is clicked', () => {
    render(<AccountPopover />);

    const iconButton = screen.getByTestId('account-popover-button');
    fireEvent.click(iconButton);

    const logoutMenuItem = screen.getByText('Logout');
    fireEvent.click(logoutMenuItem);
  });
});
