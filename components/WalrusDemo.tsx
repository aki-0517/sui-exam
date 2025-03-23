'use client';

import React, { useState, useMemo } from 'react';
import { useSuiClient, useCurrentAccount, ConnectButton } from '@mysten/dapp-kit';
import { WalrusClient } from '@mysten/walrus';
import type { Signer, SignatureWithBytes, PublicKey, IntentScope, SignatureScheme } from '@mysten/sui/cryptography';

// ダミーサイナーの実装（デモ用）
class DummySigner implements Signer {
  private publicKey: PublicKey;
  private address: string;

  constructor(publicKey: PublicKey, address: string) {
    this.publicKey = publicKey;
    this.address = address;
  }

  async sign(bytes: Uint8Array): Promise<Uint8Array> {
    return new Uint8Array();
  }
  async signWithIntent(bytes: Uint8Array, intent: IntentScope): Promise<SignatureWithBytes> {
    return { bytes: '', signature: '' };
  }
  async signTransaction(bytes: Uint8Array): Promise<SignatureWithBytes> {
    return { bytes: '', signature: '' };
  }
  async signPersonalMessage(bytes: Uint8Array): Promise<SignatureWithBytes> {
    return { bytes: '', signature: '' };
  }
  getKeyScheme(): SignatureScheme {
    return 'ED25519';
  }
  getPublicKey(): PublicKey {
    return this.publicKey;
  }
  toSuiAddress(): string {
    return this.address;
  }
}

export default function WalrusDemo() {
  const suiClient = useSuiClient();
  const currentAccount = useCurrentAccount();

  // SuiClient が利用可能な場合に walrusClient を初期化
  const walrusClient = useMemo(() => {
    if (!suiClient) return null;
    return new WalrusClient({
      network: 'testnet',
      suiClient,
    });
  }, [suiClient]);

  // Blob 読み込み用の状態管理
  const [blobId, setBlobId] = useState<string>('');
  const [blobContent, setBlobContent] = useState<string>('');
  const [readError, setReadError] = useState<string>('');

  // Blob 書き込み用の状態管理
  const [writeContent, setWriteContent] = useState<string>('');
  const [writtenBlobId, setWrittenBlobId] = useState<string>('');
  const [writeError, setWriteError] = useState<string>('');

  // ダミーサイナーの作成（実際は有効な署名ロジックに置き換え）
  const dummySigner = useMemo(() => {
    if (!currentAccount) return null;
    return new DummySigner(currentAccount.publicKey as unknown as PublicKey, currentAccount.address);
  }, [currentAccount]);

  const handleReadBlob = async () => {
    setReadError('');
    setBlobContent('');
    if (!walrusClient || !blobId) {
      setReadError('Walrus client が準備できていないか、Blob ID が未入力です。');
      return;
    }
    try {
      const blobData = await walrusClient.readBlob({ blobId });
      const content = new TextDecoder().decode(blobData);
      setBlobContent(content);
    } catch (error: any) {
      console.error(error);
      setReadError(error.message || 'Blob の読み込み中にエラーが発生しました。');
    }
  };

  const handleWriteBlob = async () => {
    setWriteError('');
    setWrittenBlobId('');
    if (!walrusClient) {
      setWriteError('Walrus client が準備できていません。');
      return;
    }
    if (!dummySigner) {
      setWriteError('有効なサイナーがありません。ウォレットに接続してください。');
      return;
    }
    try {
      const blob = new TextEncoder().encode(writeContent);
      const { blobId: newBlobId } = await walrusClient.writeBlob({
        blob,
        deletable: true,
        epochs: 3,
        signer: dummySigner,
      });
      setWrittenBlobId(newBlobId);
    } catch (error: any) {
      console.error(error);
      setWriteError(error.message || 'Blob の書き込み中にエラーが発生しました。');
    }
  };

  return (
    <section style={{ marginBottom: '2rem', padding: '1rem', border: '1px solid #ccc' }}>
      <h2>Walrus SDK Demo</h2>
      {currentAccount ? (
        <>
          <div style={{ marginBottom: '1.5rem' }}>
            <h3>Read Blob</h3>
            <input
              type="text"
              placeholder="Enter Blob ID"
              value={blobId}
              onChange={(e) => setBlobId(e.target.value)}
              style={{ width: '300px', padding: '0.5rem' }}
            />
            <button onClick={handleReadBlob} style={{ marginLeft: '1rem', padding: '0.5rem 1rem' }}>
              Read Blob
            </button>
            {readError && <p style={{ color: 'red' }}>{readError}</p>}
            {blobContent && (
              <pre style={{ background: '#f5f5f5', padding: '1rem', marginTop: '1rem' }}>
                {blobContent}
              </pre>
            )}
          </div>
          <div>
            <h3>Write Blob</h3>
            <textarea
              placeholder="Enter content to write as blob"
              value={writeContent}
              onChange={(e) => setWriteContent(e.target.value)}
              style={{ width: '300px', height: '100px', padding: '0.5rem' }}
            />
            <br />
            <button onClick={handleWriteBlob} style={{ marginTop: '1rem', padding: '0.5rem 1rem' }}>
              Write Blob
            </button>
            {writeError && <p style={{ color: 'red' }}>{writeError}</p>}
            {writtenBlobId && (
              <p style={{ marginTop: '1rem' }}>
                Blob の書き込みに成功しました。Blob ID: <strong>{writtenBlobId}</strong>
              </p>
            )}
          </div>
        </>
      ) : (
        <p>ウォレットに接続して、Walrus SDK を操作してください。</p>
      )}
    </section>
  );
}
