'use client';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import Link from 'next/link';

export function Navbar() {
  return (
    <nav className="h-16 border-b border-border bg-card flex items-center justify-between px-6 z-10 sticky top-0">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-bold tracking-tight text-primary">MezoOS</h1>
        <span className="px-2 py-1 rounded-md bg-secondary text-xs text-secondary-foreground">
          Testnet
        </span>
      </div>
      <div className="flex items-center gap-4">
        <ConnectButton showBalance={false} chainStatus="icon" />
      </div>
    </nav>
  );
}
