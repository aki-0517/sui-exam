// components/Faucet.tsx
'use client';

import React, { useState } from 'react';
import { useCurrentAccount } from '@mysten/dapp-kit';
import { getFaucetHost, requestSuiFromFaucetV0 } from '@mysten/sui/faucet';

export default function Faucet() {
  const currentAccount = useCurrentAccount();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  const handleRequestFaucet = async () => {
    if (!currentAccount) {
      setStatus('Please connect your wallet first.');
      return;
    }
    setLoading(true);
    setStatus(null);
    try {
      const faucetHost = getFaucetHost('devnet'); 
      await requestSuiFromFaucetV0({
        host: faucetHost,
        recipient: currentAccount.address,
      });
      setStatus('SUI requested successfully from the faucet.');
    } catch (error: any) {
      console.error('Faucet error:', error);
      setStatus('Error requesting SUI from faucet: ' + (error.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <section style={{ margin: '2rem 0', padding: '1rem', border: '1px solid #ccc' }}>
      <h2>Faucet</h2>
      <p>Request SUI from the network faucet.</p>
      <button onClick={handleRequestFaucet} disabled={loading} style={{ padding: '0.5rem 1rem' }}>
        {loading ? 'Requesting...' : 'Request SUI'}
      </button>
      {status && <p>{status}</p>}
    </section>
  );
}
