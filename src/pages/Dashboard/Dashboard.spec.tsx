import { render, screen } from '@testing-library/react';
import { Dashboard } from './Dashboard';

test('renders Dashboard text', () => {
  render(<Dashboard />);
  const dashboardElement = screen.getByText(/dashboard/i);
  expect(dashboardElement).toBeInTheDocument();
});
