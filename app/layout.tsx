// app/layout.tsx (サーバーコンポーネント)
import './globals.css';
import '@mysten/dapp-kit/dist/index.css';
import { ReactNode } from 'react';
import ClientProviders from '../components/ClientProviders';

export const metadata = {
  title: 'Sui dApp Kit Demo',
  description: 'A demo dApp using Sui dApp Kit',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
