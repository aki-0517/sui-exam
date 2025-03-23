// components/SwitchAccount.tsx
'use client';
import React from 'react';
import { useAccounts, useSwitchAccount } from '@mysten/dapp-kit';

const SwitchAccount = () => {
  const accounts = useAccounts();
  const { mutate: switchAccount } = useSwitchAccount();

  return (
    <section style={{ marginBottom: '2rem' }}>
      <h3>Switch Account</h3>
      {accounts.length > 0 ? (
        <ul>
          {accounts.map((account) => (
            <li key={account.address} style={{ marginBottom: '0.5rem' }}>
              <button
                onClick={() =>
                  switchAccount(
                    { account },
                    {
                      onSuccess: () => console.log(`Switched to ${account.address}`),
                      onError: (err) => console.error(err),
                    }
                  )
                }
                style={{ padding: '0.5rem 1rem' }}
              >
                Switch to {account.address}
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No accounts connected.</p>
      )}
    </section>
  );
};

export default SwitchAccount;
