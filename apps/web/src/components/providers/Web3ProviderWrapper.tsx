'use client';
import { useState, useEffect, ReactNode } from 'react';
import dynamic from 'next/dynamic';

const RealWeb3Provider = dynamic(
  () => import('./Web3Provider').then(m => m.Web3Provider),
  { ssr: false }
);

export function Web3ProviderWrapper({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return <RealWeb3Provider>{children}</RealWeb3Provider>;
}
