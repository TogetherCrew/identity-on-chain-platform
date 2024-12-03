import { fireEvent, render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';

import { SIDEBAR_MENU } from '../../libs/constants';

import SidebarApp from './SidebarApp';

// Mock the constants
vi.mock('../../libs/constants', () => ({
  DRAWER_WIDTH: 240,
  SIDEBAR_MENU: [
    {
      title: 'Home',
      path: '/home',
      icon: vi.fn(() => <div data-testid="home-icon" />),
    },
    {
      title: 'Settings',
      path: '/settings',
      icon: vi.fn(() => <div data-testid="settings-icon" />),
    },
  ],
}));

describe('SidebarApp', () => {
  it('should render the SidebarApp component', () => {
    render(
      <BrowserRouter>
        <SidebarApp />
      </BrowserRouter>
    );

    const drawer = screen.getByTestId('drawer_app');
    expect(drawer).toBeInTheDocument();

    const logo = screen.getByText('LogID');
    expect(logo).toBeInTheDocument();

    SIDEBAR_MENU.forEach((item) => {
      const menuItem = screen.getByText(item.title);
      expect(menuItem).toBeInTheDocument();
    });
  });

  it('should navigate to the correct route on menu item click', () => {
    render(
      <BrowserRouter>
        <SidebarApp />
      </BrowserRouter>
    );

    const homeMenuItem = screen.getByText('Home');
    fireEvent.click(homeMenuItem);

    expect(window.location.pathname).toBe('/home');
  });
});
