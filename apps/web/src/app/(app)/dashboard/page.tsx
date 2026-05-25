'use client';
import { useState } from 'react';
import { ArrowUpRight, ArrowDownRight, DollarSign, Bitcoin, ShieldAlert, Loader2 } from 'lucide-react';
import { useAccount, useBalance, useWriteContract, useReadContract } from 'wagmi';
import { parseEther, encodeFunctionData, formatEther } from 'viem';
import { CONTRACT_ADDRESSES, MezoTreasuryABI, ERC20ABI } from '@/config/contracts';
import { toast } from 'sonner';

export default function DashboardPage() {
  const { address, isConnected } = useAccount();
  const { data: balance } = useBalance({ address });
  const [depositAmount, setDepositAmount] = useState('0.0001');
  const [isPending, setIsPending] = useState(false);

  const { writeContractAsync } = useWriteContract();

  const { data: btcCollateralRaw, refetch: refetchBtc } = useReadContract({
    address: CONTRACT_ADDRESSES.MezoTreasury as `0x${string}`,
    abi: MezoTreasuryABI,
    functionName: 'btcCollateral',
    args: address ? [address] : undefined,
    query: { enabled: !!address }
  });

  const { data: musdBorrowedRaw, refetch: refetchMusd } = useReadContract({
    address: CONTRACT_ADDRESSES.MockMUSD as `0x${string}`,
    abi: ERC20ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: { enabled: !!address }
  });

  const handleDeposit = async () => {
    if (!isConnected || !address) {
      toast.error('Please connect your wallet first.');
      return;
    }

    try {
      setIsPending(true);
      
      const txHash = await writeContractAsync({
        address: CONTRACT_ADDRESSES.MezoTreasury as `0x${string}`,
        abi: MezoTreasuryABI,
        functionName: 'depositMockBTC',
        args: [parseEther(depositAmount || '0')]
      });

      toast.success(`Successfully deposited ${depositAmount} BTC! Tx Hash: ${txHash}`);
      setIsPending(false);
      refetchBtc();
      refetchMusd();
    } catch (e: any) {
      setIsPending(false);
      console.error(e);
      toast.error(`Transaction failed: ${e.message}`);
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
            <p className="text-sm font-medium text-muted-foreground">Wallet Balance (Real)</p>
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
              <Bitcoin size={16} className="text-primary" />
            </div>
          </div>
          <p className="text-3xl font-bold">
            {balance ? `${Number(balance.formatted).toFixed(4)} ${balance.symbol}` : '0.0000 BTC'}
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Available in connected wallet
          </p>
        </div>

        <div className="bg-card p-6 rounded-2xl border border-border shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-medium text-muted-foreground">BTC Collateral</p>
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
              <Bitcoin size={16} className="text-primary" />
            </div>
          </div>
          <p className="text-3xl font-bold">
            {btcCollateralRaw ? Number(formatEther(btcCollateralRaw as bigint)).toFixed(4) : '0.0000'} BTC
          </p>
          <p className="text-sm text-green-500 flex items-center gap-1 mt-2">
            <ArrowUpRight size={14} /> Total Deposited
          </p>
        </div>

        <div className="bg-card p-6 rounded-2xl border border-border shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-medium text-muted-foreground">MUSD Borrowed</p>
            <div className="w-8 h-8 rounded-full bg-destructive/20 flex items-center justify-center">
              <DollarSign size={16} className="text-destructive" />
            </div>
          </div>
          <p className="text-3xl font-bold">
            {musdBorrowedRaw ? Number(formatEther(musdBorrowedRaw as bigint)).toLocaleString(undefined, { maximumFractionDigits: 2 }) : '0'} MUSD
          </p>
          <p className="text-sm text-muted-foreground mt-2">@ 1% fixed APR</p>
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
          
          <div className="flex flex-col gap-4 w-full max-w-xs">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setDepositAmount('0.0001')}
                className="flex-1 py-2 text-sm bg-secondary hover:bg-secondary/80 rounded-md transition-colors"
              >
                0.0001 BTC
              </button>
              <button
                onClick={() => setDepositAmount('1.0')}
                className="flex-1 py-2 text-sm bg-secondary hover:bg-secondary/80 rounded-md transition-colors"
              >
                1.0 BTC
              </button>
            </div>
            
            <input 
              type="number"
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)}
              className="w-full bg-background border border-border rounded-md px-3 py-2 text-center focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Custom amount"
              step="0.0001"
            />
            
            <button 
              onClick={handleDeposit}
              disabled={isPending || !depositAmount}
              className="w-full bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isPending && <Loader2 className="animate-spin" size={16} />}
              Deposit {depositAmount || '0'} BTC
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
