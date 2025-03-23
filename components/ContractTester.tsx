'use client';

import React, { useState } from 'react';
import {
  ConnectButton,
  useCurrentAccount,
  useSignAndExecuteTransaction,
} from '@mysten/dapp-kit';
import { TransactionBlock, JsonRpcProvider, Connection } from '@mysten/sui.js';
import { toBase64 } from '@mysten/sui/utils';

const PACKAGE_ID =
  '0x38df011cc9734a23e89b5a94e60e7ba6bd17d37a6d40acb231acfda68c4fc364';

const connection = new Connection({ fullnode: 'https://fullnode.devnet.sui.io' });
const provider = new JsonRpcProvider(connection);

export default function ContractTester() {
  const currentAccount = useCurrentAccount();
  const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [nfts, setNFTs] = useState<any[]>([]);

  // NFTのMint処理（devnet_nft::mint）
  const handleMintNFT = async () => {
    if (!currentAccount) {
      setStatus('ウォレットを接続してください。');
      return;
    }
    setLoading(true);
    setStatus(null);
    try {
      const tx = new TransactionBlock();
      // 送信者を設定
      tx.setSender(currentAccount.address);

      // devnet_nft モジュールの mint 関数を呼び出してNFTを発行
      tx.moveCall({
        target: `${PACKAGE_ID}::devnet_nft::mint`,
        arguments: [
          tx.pure("Test NFT"),           // NFT名
          tx.pure("This is a test NFT."),  // 説明
          tx.pure("https://example.com/nft.png"), // 画像URL
        ],
      });

      // プロバイダーを渡してトランザクションをビルド（Uint8Array）し、Base64文字列に変換
      const txBytes = await tx.build({ provider });
      const serializedTx = toBase64(txBytes);

      signAndExecuteTransaction(
        {
          transaction: serializedTx,
          chain: 'sui:devnet',
        },
        {
          onSuccess: (result) => {
            setStatus(`NFTの発行に成功しました。トランザクションダイジェスト: ${result.digest}`);
          },
          onError: (error) => {
            console.error('Mint NFT error:', error);
            setStatus('NFTの発行に失敗しました: ' + (error.message || 'Unknown error'));
          },
        }
      );
    } catch (error: any) {
      console.error('Mint NFT error:', error);
      setStatus('NFTの発行に失敗しました: ' + (error.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  // NFTのTransfer処理（devnet_nft::transfer）
  const handleTransferNFT = async () => {
    if (!currentAccount) {
      setStatus('ウォレットを接続してください。');
      return;
    }
    const recipient = prompt('転送先のアドレスを入力してください:');
    if (!recipient) {
      setStatus('転送先アドレスが必要です。');
      return;
    }
    const nftId = prompt('転送するNFTのオブジェクトIDを入力してください:');
    if (!nftId) {
      setStatus('NFTオブジェクトIDが必要です。');
      return;
    }
    setLoading(true);
    setStatus(null);
    try {
      const tx = new TransactionBlock();
      tx.setSender(currentAccount.address);
      tx.moveCall({
        target: `${PACKAGE_ID}::devnet_nft::transfer`,
        arguments: [tx.object(nftId), tx.pure(recipient)],
      });
      const txBytes = await tx.build({ provider });
      const serializedTx = toBase64(txBytes);
      signAndExecuteTransaction(
        {
          transaction: serializedTx,
          chain: 'sui:devnet',
        },
        {
          onSuccess: (result) => {
            setStatus(`NFTの転送に成功しました。トランザクションダイジェスト: ${result.digest}`);
          },
          onError: (error) => {
            console.error('Transfer NFT error:', error);
            setStatus('NFTの転送に失敗しました: ' + (error.message || 'Unknown error'));
          },
        }
      );
    } catch (error: any) {
      console.error('Transfer NFT error:', error);
      setStatus('NFTの転送に失敗しました: ' + (error.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  // NFTの読み込み処理
  const handleFetchNFTs = async () => {
    if (!currentAccount) {
      setStatus('ウォレットを接続してください。');
      return;
    }
    setLoading(true);
    setStatus(null);
    try {
      // 自身の所有オブジェクトから、DevNetNFT 型のものを取得
      const ownedObjectsResponse = await provider.getOwnedObjects({
        owner: currentAccount.address,
        filter: {
          StructType: `${PACKAGE_ID}::devnet_nft::DevNetNFT`,
        },
        options: { showContent: true },
      });
      setNFTs(ownedObjectsResponse.data);
      setStatus('NFTの取得に成功しました。');
    } catch (error: any) {
      console.error('Fetch NFTs error:', error);
      setStatus('NFTの取得に失敗しました: ' + (error.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <section style={{ margin: '2rem 0', padding: '1rem', border: '1px solid #ccc' }}>
      <h2>Contract Tester</h2>
      <p>
        以下の各ボタンをクリックして、コントラクトの各機能（NFTの発行、転送、取得、更新、Burn）を試すことができます。
      </p>
      <ConnectButton />
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '1rem' }}>
        <button onClick={handleMintNFT} disabled={loading} style={{ padding: '0.5rem 1rem' }}>
          {loading ? 'Processing...' : 'Mint NFT'}
        </button>
        <button onClick={handleTransferNFT} disabled={loading} style={{ padding: '0.5rem 1rem' }}>
          {loading ? 'Processing...' : 'Transfer NFT'}
        </button>
        <button onClick={handleFetchNFTs} disabled={loading} style={{ padding: '0.5rem 1rem' }}>
          {loading ? 'Processing...' : 'Fetch My NFTs'}
        </button>
      </div>
      {status && <p style={{ marginTop: '1rem' }}>{status}</p>}
      <div style={{ marginTop: '1rem' }}>
        {nfts.length > 0 && <h3>My NFTs:</h3>}
        {nfts.map((nft) => {
          const content = nft.data.content;
          const fields = content && content.fields;
          return (
            <div key={nft.data.objectId} style={{ border: '1px solid #ccc', padding: '0.5rem', marginBottom: '0.5rem' }}>
              <p>
                <strong>Name:</strong> {fields?.name}
              </p>
              <p>
                <strong>Description:</strong> {fields?.description}
              </p>
              {fields?.url && (
                <img src={fields.url} alt={fields.name} style={{ maxWidth: '200px' }} />
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
