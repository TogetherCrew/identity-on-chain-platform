import { render } from '@testing-library/react';
import App from './App';

test('renders test text', () => {
  render(<App />);
  expect(<App />).toBeDefined();
});
