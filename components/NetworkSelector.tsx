// components/NetworkSelector.tsx
'use client';
import React from 'react';
import { useSuiClientContext } from '@mysten/dapp-kit';

const NetworkSelector = () => {
  const ctx = useSuiClientContext();

  return (
    <section style={{ marginBottom: '2rem' }}>
      <h2>Network Selector</h2>
      {Object.keys(ctx.networks).map((network) => (
        <button
          key={network}
          onClick={() => ctx.selectNetwork(network)}
          style={{ marginRight: '1rem', padding: '0.5rem 1rem' }}
        >
          {`Select ${network}`}
        </button>
      ))}
      <p>Current network: {ctx.network}</p>
    </section>
  );
};

export default NetworkSelector;
