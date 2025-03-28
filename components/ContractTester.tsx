'use client';

import React, { useState } from 'react';
import {
  useCurrentAccount,
  useSignAndExecuteTransaction,
  useSuiClient,
} from '@mysten/dapp-kit';
import { Transaction } from '@mysten/sui/transactions';

const PACKAGE_ID =
  "0x9b0f6257b3c75f5bdfc252b20d3a8199da5465f968d429bceabe9b916af36560";
const NFT_TYPE = `${PACKAGE_ID}::devnet_nft::DevNetNFT`;

// 補助関数: MoveStruct（または MoveValue）を { [key: string]: string } に変換
function parseMeta(fields: any): { [key: string]: string } | undefined {
  if (Array.isArray(fields)) {
    return undefined;
  }
  if (fields && typeof fields === 'object' && 'fields' in fields) {
    const obj = fields.fields;
    const result: { [key: string]: string } = {};
    for (const key in obj) {
      const value = obj[key];
      result[key] = typeof value === 'string' ? value : JSON.stringify(value);
    }
    return result;
  }
  if (fields && typeof fields === 'object') {
    const result: { [key: string]: string } = {};
    for (const key in fields) {
      const value = fields[key];
      result[key] = typeof value === 'string' ? value : JSON.stringify(value);
    }
    return result;
  }
  return undefined;
}

export default function NFTOperations() {
  const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();
  const currentAccount = useCurrentAccount();
  const client = useSuiClient();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [url, setUrl] = useState('');
  const [txResult, setTxResult] = useState<any>(null);
  const [nftList, setNftList] = useState<any[]>([]);
  const [detailedNFTs, setDetailedNFTs] = useState<any[]>([]);
  // 選択されたNFTの objectId を保持
  const [selectedNFT, setSelectedNFT] = useState<string | null>(null);

  // NFT作成（mint）の呼び出し
  const handleMint = async () => {
    try {
      const tx = new Transaction();
      tx.moveCall({
        target: `${PACKAGE_ID}::devnet_nft::mint`,
        arguments: [
          tx.pure.string(name),
          tx.pure.string(description),
          tx.pure.string(url),
        ],
      });
      const result = await signAndExecuteTransaction({ transaction: tx });
      setTxResult(result);
    } catch (error) {
      console.error("Mint error:", error);
    }
  };

  // 選択したNFTのdescription更新の呼び出し
  const handleUpdateDescription = async () => {
    if (!selectedNFT) {
      console.error("NFTが選択されていません");
      return;
    }
    try {
      // 更新する新しいdescription（ここは固定値ですが、必要に応じて入力フィールドなどで動的に設定可能）
      const newDescription = "New description from UI";
      const tx = new Transaction();
      tx.moveCall({
        target: `${PACKAGE_ID}::devnet_nft::update_description`,
        arguments: [
          tx.object(selectedNFT),
          tx.pure.string(newDescription),
        ],
      });
      const result = await signAndExecuteTransaction({ transaction: tx });
      setTxResult(result);
    } catch (error) {
      console.error("Update description error:", error);
    }
  };

  // 選択したNFTのburn（削除）の呼び出し
  const handleBurn = async () => {
    if (!selectedNFT) {
      console.error("NFTが選択されていません");
      return;
    }
    try {
      const tx = new Transaction();
      tx.moveCall({
        target: `${PACKAGE_ID}::devnet_nft::burn`,
        arguments: [
          tx.object(selectedNFT),
        ],
      });
      const result = await signAndExecuteTransaction({ transaction: tx });
      setTxResult(result);
    } catch (error) {
      console.error("Burn error:", error);
    }
  };

  // 所有しているNFT一覧と詳細情報を取得する
  const handleFetchNFTs = async () => {
    try {
      if (!currentAccount?.address) {
        console.error("ウォレットが接続されていません");
        return;
      }
      const response = await client.getOwnedObjects({
        owner: currentAccount.address,
        filter: { StructType: NFT_TYPE },
      });
      const ownedNFTs = response.data;
      setNftList(ownedNFTs);

      const details = await Promise.all(
        ownedNFTs.map(async (nft, index) => {
          const objectId = nft.data?.objectId;
          if (!objectId) return null;
          const detailRes = await client.getObject({
            id: objectId,
            options: {
              showContent: true,
              showDisplay: true,
            },
          });
          let meta: { [key: string]: string } | undefined;
          if (detailRes.data?.display?.data) {
            meta = detailRes.data.display.data as { [key: string]: string };
          } else if (
            detailRes.data?.content &&
            detailRes.data.content.dataType === 'moveObject'
          ) {
            meta = parseMeta(detailRes.data.content.fields);
          }
          return {
            objectId,
            version: nft.data?.version,
            digest: nft.data?.digest,
            name: meta?.name,
            description: meta?.description,
            url: meta?.url,
          };
        })
      );
      setDetailedNFTs(details.filter((item) => item !== null));
    } catch (error) {
      console.error("Error fetching NFTs:", error);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>DevNet NFT Operations</h1>
      <section style={{ marginBottom: '20px' }}>
        <h2>Mint NFT</h2>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ marginRight: '10px' }}
        />
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={{ marginRight: '10px' }}
        />
        <input
          type="text"
          placeholder="URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          style={{ marginRight: '10px' }}
        />
        <button onClick={handleMint}>Mint NFT</button>
      </section>
      <section style={{ marginBottom: '20px' }}>
        <h2>Update NFT Description</h2>
        <p>
          ※updateおよびburnは、下記のNFT一覧から対象のNFTを選択した上で実行してください。
        </p>
        <button onClick={handleUpdateDescription}>Update Description</button>
      </section>
      <section style={{ marginBottom: '20px' }}>
        <h2>Burn NFT</h2>
        <button onClick={handleBurn}>Burn NFT</button>
      </section>
      <section style={{ marginBottom: '20px' }}>
        <h2>Fetch My Minted NFTs</h2>
        <button onClick={handleFetchNFTs}>Fetch NFTs</button>
        {detailedNFTs.length > 0 && (
          <ul>
            {detailedNFTs.map((nft, index) => (
              <li
                key={nft.objectId || `nft-${index}`}
                style={{
                  border:
                    selectedNFT === nft.objectId
                      ? '2px solid blue'
                      : '1px solid #ccc',
                  marginBottom: '10px',
                  padding: '10px',
                }}
              >
                <div>ID: {nft.objectId}</div>
                <div>Version: {nft.version}</div>
                <div>Digest: {nft.digest}</div>
                <div>Name: {nft.name || '未設定'}</div>
                <div>Description: {nft.description || '未設定'}</div>
                <div>URL: {nft.url || '未設定'}</div>
                <button onClick={() => setSelectedNFT(nft.objectId)}>
                  {selectedNFT === nft.objectId ? '選択中' : 'Select'}
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
      {txResult && (
        <section>
          <h3>Transaction Result</h3>
          <pre>{JSON.stringify(txResult, null, 2)}</pre>
        </section>
      )}
    </div>
  );
}
