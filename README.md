# Sui dApp Kit Demo

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app). This demo application integrates with the Sui blockchain using the Sui dApp Kit and Sui TypeScript SDK. It provides a full suite of functionalities including wallet connection, network selection, RPC queries, transaction signing/execution, and account switching.

## Features

- **Wallet Connection:**  
  Easily connect to any Sui-compatible wallet using the dApp Kit's built-in `ConnectButton`. The app automatically manages wallet state and updates connected accounts.

- **Network Selection:**  
  Switch between different Sui networks (e.g., localnet, mainnet) using a custom network selector. The app leverages SuiClientProvider to manage network configurations and active network state.

- **RPC Queries:**  
  Query blockchain data (like owned objects) via hooks provided by the dApp Kit. The demo shows how to execute queries with `useSuiClientQuery`.

- **Transaction Execution:**  
  Two approaches are demonstrated:
  - **Sign & Execute Transaction:** Use `useSignAndExecuteTransaction` to sign and execute a transaction in one step, and then wait for the transaction to finalize.
  - **Sign Transaction Only:** Sign a transaction using `useSignTransaction`, manually execute it via SuiClient's `executeTransactionBlock`, and report transaction effects.
  
- **Account Switching:**  
  Switch between multiple wallet accounts using the provided hooks. The app displays a list of connected accounts and lets users select the account they want to switch to.

## Getting Started

First, install the dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

```
my-sui-dapp/
├── app/
│   ├── layout.tsx        // Root layout (server component) with client providers
│   └── page.tsx          // Main page displaying the app functionalities
├── components/
│   ├── ClientProviders.tsx  // Client-side provider wrapper (React Query, SuiClientProvider, WalletProvider)
│   ├── ConnectWallet.tsx    // Wallet connection component using ConnectButton
│   ├── NetworkSelector.tsx  // Network selection component for switching Sui networks
│   ├── QueryData.tsx        // RPC query component to fetch blockchain data
│   ├── TransactionDemo.tsx  // Transaction demo with sign & execute and sign-only methods
│   └── SwitchAccount.tsx    // Account switching component
├── package.json
└── tsconfig.json
```

## Learn More

To learn more about Next.js and the technologies used in this project, check out the following resources:

- [Next.js Documentation](https://nextjs.org/docs) – Learn about Next.js features and APIs.
- [Sui dApp Kit Documentation](https://github.com/MystenLabs/sui-dapp-kit) – Explore Sui dApp Kit features and usage.
- [Sui TypeScript SDK Documentation](https://github.com/MystenLabs/sui) – Learn how to use SuiClient for JSON-RPC operations.
- [React Query Documentation](https://react-query.tanstack.com) – Understand how to fetch and cache data using React Query.

## Deploy on Vercel

The easiest way to deploy this Next.js app is to use the [Vercel Platform](https://vercel.com/new). Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
