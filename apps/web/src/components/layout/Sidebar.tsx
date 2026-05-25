'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, FileText, Repeat, Bot, Activity, Users, Settings } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Invoices', href: '/invoices', icon: FileText },
  { name: 'Subscriptions', href: '/subscriptions', icon: Repeat },
  { name: 'Event Logs', href: '/events', icon: Activity },
  { name: 'AI Assistant', href: '/ai', icon: Bot },
];

import { useAccount, useBalance, useReadContract } from 'wagmi';
import { formatUnits } from 'viem';
import { CONTRACT_ADDRESSES, ERC20ABI } from '@/config/contracts';
import { useEffect, useState } from 'react';

export function Sidebar() {
  const pathname = usePathname();
  const { address } = useAccount();
  
  const { data: btcBalance } = useBalance({ address });
  
  const { data: musdBalance } = useReadContract({
    address: CONTRACT_ADDRESSES.MockMUSD as `0x${string}`,
    abi: ERC20ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: { enabled: !!address }
  });

  // Fallback for when Wagmi's public RPC is down but the user's MetaMask RPC works
  const [fallbackBtc, setFallbackBtc] = useState<string | null>(null);
  
  useEffect(() => {
    if (address && !btcBalance && (window as any).ethereum) {
      (window as any).ethereum.request({
        method: 'eth_getBalance',
        params: [address, 'latest']
      }).then((bal: string) => {
        setFallbackBtc(Number(formatUnits(BigInt(bal), 18)).toFixed(4));
      }).catch(console.error);
    }
  }, [address, btcBalance]);

  return (
    <aside className="w-64 border-r border-border bg-card h-[calc(100vh-4rem)] sticky top-16 flex flex-col">
      <div className="flex-1 py-6 px-4 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-sm font-medium",
                isActive 
                  ? "bg-secondary text-primary" 
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
              )}
            >
              <item.icon size={18} />
              {item.name}
            </Link>
          );
        })}
      </div>
      
      <div className="p-4 border-t border-border space-y-3">
        <div className="bg-secondary/50 rounded-lg p-4">
          <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wider">Your Balances</p>
          <div className="space-y-2 mt-3">
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">BTC</span>
              <span className="font-semibold text-foreground">
                {btcBalance ? Number(btcBalance.formatted).toFixed(4) : (fallbackBtc || '0.0000')}
              </span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">MUSD</span>
              <span className="font-semibold text-foreground">
                {musdBalance ? Number(formatUnits(musdBalance as bigint, 18)).toFixed(2) : '0.00'}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-secondary/50 rounded-lg p-4">
          <p className="text-xs text-muted-foreground mb-2">Mezo Utility Tier</p>
          <div className="flex items-center justify-between">
            <span className="font-semibold text-primary text-sm">Pro Tier</span>
            <span className="text-[10px] bg-primary/20 text-primary px-2 py-0.5 rounded">Active</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
