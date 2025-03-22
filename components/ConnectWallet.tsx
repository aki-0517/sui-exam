// components/ConnectWallet.tsx
'use client';
import React from 'react';
import { ConnectButton } from '@mysten/dapp-kit';

const ConnectWallet = () => {
  return (
    <section style={{ marginBottom: '2rem' }}>
      <h2>Connect Wallet</h2>
      <ConnectButton connectText="Connect Wallet" />
    </section>
  );
};

export default ConnectWallet;
