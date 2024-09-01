import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import AppbarApp from './AppbarApp';

// Mocking the ConnectButton from RainbowKit
vi.mock('@rainbow-me/rainbowkit', () => ({
  ConnectButton: () => (
    <div data-testid="connect-button">Mocked ConnectButton</div>
  ),
}));

describe('AppbarApp', () => {
  it('should render the AppbarApp component', () => {
    render(<AppbarApp />);

    const appBar = screen.getByTestId('Appbar');
    expect(appBar).toBeInTheDocument();
  });

  it('should render the ConnectButton', () => {
    render(<AppbarApp />);

    const connectButton = screen.getByTestId('connect-button');
    expect(connectButton).toBeInTheDocument();
  });
});
