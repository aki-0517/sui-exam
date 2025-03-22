// components/QueryData.tsx
'use client';
import React from 'react';
import { useSuiClientQuery } from '@mysten/dapp-kit';

const QueryData = () => {
  // サンプルクエリ：固定のオーナーアドレスを利用（実際は接続したウォレットのアドレスを使用）
  const { data, isPending, isError, error, refetch } = useSuiClientQuery('getOwnedObjects', {
    owner: '0x123',
  });

  return (
    <section style={{ marginBottom: '2rem' }}>
      <h2>Query Sui Data (getOwnedObjects)</h2>
      {isPending && <p>Loading...</p>}
      {isError && <p>Error: {error?.message}</p>}
      {data && (
        <pre style={{ background: '#f5f5f5', padding: '1rem' }}>
          {JSON.stringify(data, null, 2)}
        </pre>
      )}
      <button onClick={() => refetch()} style={{ marginTop: '1rem', padding: '0.5rem 1rem' }}>
        Refetch Data
      </button>
    </section>
  );
};

export default QueryData;
