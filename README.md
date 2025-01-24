[![Maintainability](https://api.codeclimate.com/v1/badges/94d9f25b5a7480c7f98e/maintainability)](https://codeclimate.com/github/TogetherCrew/identity-on-chain-platform/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/94d9f25b5a7480c7f98e/test_coverage)](https://codeclimate.com/github/TogetherCrew/identity-on-chain-platform/test_coverage)

# LogId Frontend App

This project serves as the frontend for the LogId platform, a decentralized identity-on-chain solution.

## Features

- React + TypeScript with Vite
- State management with Zustand
- Data fetching with Axios and React Query
- UI components powered by Material-UI
- Integration with Ethereum Attestation Service (EAS)
- Blockchain interaction via wagmi and viem
- TailwindCSS for styling
- Testing setup with Vitest and Testing Library

## Getting Started

### Environment Variables

To set up environment variables:

1. **Copy the Example File**:  
   Run:

   ```bash
   cp .env.example .env.local
   ```

2. **Update Variables**:  
   Replace placeholders in `.env.local` with actual values.

> **Note**: Do not commit `.env.local` to version control; use `.env.example` to document new variables.

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/TogetherCrew/identity-on-chain-platform.git
   cd identity-on-chain-platform
   ```

2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Start the development server:
   ```bash
   pnpm dev
   ```

### Scripts

- `pnpm dev`: Start the development server.
- `pnpm build`: Build the production-ready app.
- `pnpm preview`: Preview the production build.
- `pnpm lint`: Run ESLint and Prettier.
- `pnpm lint:fix`: Automatically fix lint errors.
- `pnpm test`: Run the tests.
- `pnpm coverage`: Generate test coverage reports.
- `pnpm format`: Format the code using Prettier.

## Expanding the ESLint Configuration

If you are developing a production application, we recommend updating the ESLint configuration to enable type-aware lint rules:

1. Configure the top-level `parserOptions` property like this:

   ```js
   export default {
     parserOptions: {
       ecmaVersion: 'latest',
       sourceType: 'module',
       project: ['./tsconfig.json', './tsconfig.node.json'],
       tsconfigRootDir: __dirname,
     },
   };
   ```

2. Replace `plugin:@typescript-eslint/recommended` with `plugin:@typescript-eslint/recommended-type-checked` or `plugin:@typescript-eslint/strict-type-checked`.

3. Optionally add `plugin:@typescript-eslint/stylistic-type-checked`.

4. Install `eslint-plugin-react` and add `plugin:react/recommended` and `plugin:react/jsx-runtime` to the `extends` list.

## Dependencies

Key dependencies:

- `@mui/material`: UI components library.
- `@tanstack/react-query`: Data fetching and state management.
- `zustand`: Lightweight state management.
- `ethers`: Ethereum interaction library.
- `wagmi`: React hooks for Web3.
- `viem`: Ethereum client.
- `tailwindcss`: Utility-first CSS framework.
- `vitest`: Blazing fast unit testing framework.

## Development Workflow

1. Follow the installation steps to set up your local environment.
2. Use `pnpm dev` to start the development server.
3. Write and test your code with Vitest and Testing Library.
4. Run `pnpm lint` to ensure code quality.
5. Build for production using `pnpm build`.

## Contribution Guidelines

Contributions are welcome! Follow these steps to contribute:

1. Fork the repository.
2. Create a new branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. Make your changes.
4. Run tests and linting to ensure everything works:
   ```bash
   pnpm test
   pnpm lint
   ```
5. Commit and push your changes.
6. Open a pull request.

## License

This project is licensed under the MIT License. See the LICENSE file for more information.

---

For more details about the maintainability and test coverage, refer to the badges at the top of this README.
