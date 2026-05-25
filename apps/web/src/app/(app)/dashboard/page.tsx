'use client';
import { useState } from 'react';
import { ArrowUpRight, ArrowDownRight, DollarSign, Bitcoin, ShieldAlert, Loader2 } from 'lucide-react';
import { useWriteContract, useAccount } from 'wagmi';
import { CONTRACT_ADDRESSES, MezoTreasuryABI } from '@/config/contracts';
import { toast } from 'sonner';

export default function DashboardPage() {
  const { isConnected } = useAccount();
  const { writeContract, isPending } = useWriteContract();

  const handleDeposit = () => {
    if (!isConnected) {
      toast.error('Please connect your wallet first.');
      return;
    }

    try {
      writeContract({
        address: CONTRACT_ADDRESSES.MezoTreasury as `0x${string}`,
        abi: MezoTreasuryABI,
        functionName: 'depositMockBTC',
        args: [1], // Mock depositing 1 BTC
      }, {
        onSuccess: (hash) => {
          toast.success(`Successfully deposited 1 BTC! Tx Hash: ${hash}`);
        },
        onError: (error) => {
          toast.error(`Transaction failed: ${error.message}`);
        }
      });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Treasury Overview</h1>
        <p className="text-muted-foreground">Manage your BTC collateral and MUSD operating balance.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-card p-6 rounded-2xl border border-border shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-medium text-muted-foreground">BTC Collateral</p>
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
              <Bitcoin size={16} className="text-primary" />
            </div>
          </div>
          <p className="text-3xl font-bold">2.45 BTC</p>
          <p className="text-sm text-green-500 flex items-center gap-1 mt-2">
            <ArrowUpRight size={14} /> +0.15 this month
          </p>
        </div>

        <div className="bg-card p-6 rounded-2xl border border-border shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-medium text-muted-foreground">MUSD Borrowed</p>
            <div className="w-8 h-8 rounded-full bg-destructive/20 flex items-center justify-center">
              <DollarSign size={16} className="text-destructive" />
            </div>
          </div>
          <p className="text-3xl font-bold">45,000 MUSD</p>
          <p className="text-sm text-muted-foreground mt-2">@ 1% fixed APR</p>
        </div>

        <div className="bg-card p-6 rounded-2xl border border-border shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-medium text-muted-foreground">Operating Balance</p>
            <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
              <DollarSign size={16} className="text-green-500" />
            </div>
          </div>
          <p className="text-3xl font-bold">12,450 MUSD</p>
          <p className="text-sm text-muted-foreground mt-2">Available to spend</p>
        </div>

        <div className="bg-card p-6 rounded-2xl border border-border shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-medium text-muted-foreground">Health Factor</p>
            <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
              <ShieldAlert size={16} className="text-blue-500" />
            </div>
          </div>
          <p className="text-3xl font-bold">285%</p>
          <p className="text-sm text-green-500 mt-2">Healthy</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-card rounded-2xl border border-border overflow-hidden">
          <div className="p-6 border-b border-border">
            <h2 className="font-semibold text-lg">Recent Activity</h2>
          </div>
          <div className="divide-y divide-border">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-4 px-6 flex items-center justify-between hover:bg-secondary/20 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                    <ArrowDownRight size={16} className="text-red-400" />
                  </div>
                  <div>
                    <p className="font-medium">Paid Invoice #INV-00{i}</p>
                    <p className="text-sm text-muted-foreground">To: 0x123...456</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold">-250 MUSD</p>
                  <p className="text-xs text-muted-foreground">2 hours ago</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card rounded-2xl border border-border p-6 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mb-4">
            <Bitcoin className="text-primary" size={32} />
          </div>
          <h3 className="text-xl font-bold mb-2">Need more operating capital?</h3>
          <p className="text-muted-foreground mb-6 max-w-sm">
            Deposit more Bitcoin collateral to safely mint additional MUSD without selling your stack.
          </p>
          <button 
            onClick={handleDeposit}
            disabled={isPending}
            className="bg-primary text-primary-foreground px-6 py-2.5 rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center gap-2"
          >
            {isPending && <Loader2 className="animate-spin" size={16} />}
            Deposit 1 Mock BTC
          </button>
        </div>
      </div>
    </div>
  );
}
