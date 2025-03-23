import React, { useState } from 'react';
import {
  useCurrentAccount,
  useSignAndExecuteTransaction,
  useSignTransaction,
  useSuiClient,
} from '@mysten/dapp-kit';
import { Transaction } from '@mysten/sui/transactions';
import { toBase64 } from '@mysten/sui/utils';

const TransactionDemo = () => {
  const currentAccount = useCurrentAccount();
  const client = useSuiClient();
  const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();
  const { mutateAsync: signTransaction } = useSignTransaction();
  const [txDigest, setTxDigest] = useState<string>('');
  const [txSignature, setTxSignature] = useState<string>('');

  // 署名＆実行を一括で行い、waitForTransaction で最終結果を取得する例
  const handleSignAndExecute = () => {
    const tx = new Transaction();
    signAndExecuteTransaction(
      {
        transaction: tx,
        chain: 'sui:devnet',
      },
      {
        onSuccess: async (result) => {
          console.log('Transaction executed', result);
          try {
            const txDetails = await client.waitForTransaction({
              digest: result.digest,
              options: {
                showEffects: true,
                showEvents: true,
              },
            });
            setTxDigest(txDetails.digest);
          } catch (err) {
            console.error('waitForTransaction error', err);
          }
        },
        onError: (error) => {
          console.error('signAndExecute error', error);
        },
      }
    );
  };

  // 署名のみを行い、client.executeTransactionBlock と waitForTransaction を使って実行・確認する例
  const handleSignTransaction = async () => {
    try {
      const tx = new Transaction();
      const { bytes, signature, reportTransactionEffects } = await signTransaction({
        transaction: tx,
        chain: 'sui:devnet',
      });
      const executeResult = await client.executeTransactionBlock({
        transactionBlock: bytes,
        signature,
        options: {
          showEffects: true,
          showRawEffects: true,
          showEvents: true,
        },
      });
      const txDetails = await client.waitForTransaction({
        digest: executeResult.digest,
        options: {
          showEffects: true,
          showEvents: true,
        },
      });
      // rawEffectsが定義されている場合、base64に変換して報告
      if (executeResult.rawEffects) {
        const effectsBase64 = toBase64(new Uint8Array(executeResult.rawEffects));
        reportTransactionEffects(effectsBase64);
      }
      setTxSignature(signature);
      setTxDigest(txDetails.digest);
    } catch (err) {
      console.error('handleSignTransaction error', err);
    }
  };

  return (
    <section style={{ marginBottom: '2rem' }}>
      <h2>Transaction Demo</h2>
      {currentAccount ? (
        <div>
          <button
            onClick={handleSignAndExecute}
            style={{ marginRight: '1rem', padding: '0.5rem 1rem' }}
          >
            Sign & Execute Transaction
          </button>
          <button onClick={handleSignTransaction} style={{ padding: '0.5rem 1rem' }}>
            Sign Transaction Only
          </button>
          {txDigest && <p>Executed Transaction Digest: {txDigest}</p>}
          {txSignature && <p>Transaction Signature: {txSignature}</p>}
        </div>
      ) : (
        <p>Please connect your wallet to test transactions.</p>
      )}
    </section>
  );
};

export default TransactionDemo;
