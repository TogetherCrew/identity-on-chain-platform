import '@testing-library/jest-dom';

import * as matchers from '@testing-library/jest-dom/matchers';
import { expect } from 'vitest';

process.env.VITE_API_BASE_URL = 'https://onchain.togethercrew.de/api/v1/';

expect.extend(matchers);
