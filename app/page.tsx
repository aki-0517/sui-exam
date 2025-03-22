// app/page.tsx
'use client';
import React from 'react';
import ConnectWallet from '../components/ConnectWallet';
import NetworkSelector from '../components/NetworkSelector';
import QueryData from '../components/QueryData';
import TransactionDemo from '../components/TransactionDemo';
import SwitchAccount from '../components/SwitchAccount';

export default function Home() {
  return (
    <main style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Sui dApp Kit Demo</h1>
      <ConnectWallet />
      <NetworkSelector />
      <QueryData />
      <TransactionDemo />
      <SwitchAccount />
    </main>
  );
}
