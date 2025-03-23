// app/wormhole/page.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import WormholeConnect, {
  WormholeConnectConfig,
  WormholeConnectTheme,
} from '@wormhole-foundation/wormhole-connect';

export default function WormholePage() {
  const config: WormholeConnectConfig = {
    network: 'Testnet',
    chains: ['Sui', 'Avalanche'],
    ui: {
      title: 'SUI Connect TS Demo',
    },
  };

  const theme: WormholeConnectTheme = {
    mode: 'dark',
    primary: '#78c4b6',
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Wormhole Connect Demo</h1>
      <WormholeConnect config={config} theme={theme} />
      <p style={{ marginTop: '1rem' }}>
        <Link href="/">
          ← Back to Home
        </Link>
      </p>
    </div>
  );
}
