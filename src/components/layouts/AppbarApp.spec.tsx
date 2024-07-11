import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { IconButton, Avatar } from '@mui/material';
import AppbarApp from './AppbarApp';

vi.mock('./AccountPopover', () => ({
  default: () => (
    <div>
      <IconButton data-testid="account-popover-button">
        <Avatar />
      </IconButton>
      <div data-testid="account-popover">AccountPopover</div>
    </div>
  ),
}));

describe('AppbarApp', () => {
  it('should render the AppbarApp component', () => {
    render(<AppbarApp />);

    const appBar = screen.getByTestId('Appbar');
    expect(appBar).toBeInTheDocument();

    const accountPopover = screen.getByTestId('account-popover');
    expect(accountPopover).toBeInTheDocument();
  });

  it('should open AccountPopover on icon button click', () => {
    render(<AppbarApp />);

    const iconButton = screen.getByTestId('account-popover-button');
    fireEvent.click(iconButton);

    const accountPopover = screen.getByTestId('account-popover');
    expect(accountPopover).toBeVisible();
  });
});
