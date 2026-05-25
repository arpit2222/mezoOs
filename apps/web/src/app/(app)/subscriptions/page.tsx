'use client';

import { useState, useEffect } from 'react';
import { useAccount, useWriteContract, useReadContract } from 'wagmi';
import { parseEther } from 'viem';
import { CONTRACT_ADDRESSES, RecurringPaymentsABI, ERC20ABI } from '@/config/contracts';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Plus, Pause, Play, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

export default function SubscriptionsPage() {
  const { address } = useAccount();
  const [open, setOpen] = useState(false);
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [merchant, setMerchant] = useState('');
  const [amount, setAmount] = useState('');
  const [interval, setIntervalDays] = useState('');
  const [title, setTitle] = useState('');

  const fetchSubscriptions = async () => {
    if (!address) return;
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
      const res = await fetch(`${apiUrl}/api/subscriptions/${address}`);
      const data = await res.json();
      setSubscriptions(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchSubscriptions();
  }, [address]);

  const { writeContractAsync } = useWriteContract();
  const { data: nextSubIdRaw } = useReadContract({
    address: CONTRACT_ADDRESSES.RecurringPayments as `0x${string}`,
    abi: [{ name: 'nextSubId', type: 'function', stateMutability: 'view', inputs: [], outputs: [{ type: 'uint256' }] }],
    functionName: 'nextSubId'
  });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address) return toast.error('Please connect your wallet');

    try {
      toast.info('Please approve MUSD spending in MetaMask...');
      
      const approveAmount = Number(amount) * 12; // Approve for 12 billing cycles
      await writeContractAsync({
        address: CONTRACT_ADDRESSES.MockMUSD as `0x${string}`,
        abi: ERC20ABI,
        functionName: 'approve',
        args: [CONTRACT_ADDRESSES.RecurringPayments as `0x${string}`, parseEther(approveAmount.toString())]
      });

      toast.info('Approval sent. Now signing subscription creation...');

      const txHash = await writeContractAsync({
        address: CONTRACT_ADDRESSES.RecurringPayments as `0x${string}`,
        abi: RecurringPaymentsABI,
        functionName: 'createSubscription',
        args: [merchant as `0x${string}`, parseEther(amount || '0'), BigInt(Number(interval) * 24 * 60 * 60), title]
      });

      const assignedId = nextSubIdRaw ? Number(nextSubIdRaw) : Math.floor(Math.random() * 1000);

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
      const nextPaymentDate = new Date();
      nextPaymentDate.setDate(nextPaymentDate.getDate() + Number(interval));

      await fetch(`${apiUrl}/api/subscriptions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          subscriberWallet: address,
          merchantWallet: merchant,
          title,
          amount: Number(amount),
          intervalDays: Number(interval),
          nextPaymentDate,
          onchainSubId: assignedId.toString()
        })
      });
      
      toast.success('Subscription Created', {
        description: `Tx Hash: ${txHash.substring(0, 10)}...`,
      });
      setOpen(false);
      fetchSubscriptions();
    } catch (err: any) {
      toast.error(`Failed to create subscription: ${err.message}`);
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
      await fetch(`${apiUrl}/api/subscriptions/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      toast.success(`Subscription ${newStatus === 'paused' ? 'paused' : 'resumed'}`);
      fetchSubscriptions();
    } catch (err) {
      toast.error('Failed to update subscription');
    }
  };

  const handleDelete = async (id: string, onchainSubId?: string) => {
    try {
      toast.info('Please sign cancellation in MetaMask...');
      
      await writeContractAsync({
        address: CONTRACT_ADDRESSES.RecurringPayments as `0x${string}`,
        abi: RecurringPaymentsABI,
        functionName: 'cancelSubscription',
        args: [BigInt(onchainSubId || '1')]
      });

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
      await fetch(`${apiUrl}/api/subscriptions/${id}`, {
        method: 'DELETE',
      });
      toast.success('Subscription cancelled on-chain and removed');
      fetchSubscriptions();
    } catch (err: any) {
      toast.error(`Failed to cancel subscription: ${err.message}`);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Subscriptions</h1>
          <p className="text-muted-foreground">Manage your recurring MUSD obligations.</p>
        </div>
        
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
            <Plus size={16} /> New Subscription
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] border-border bg-card">
            <DialogHeader>
              <DialogTitle>Create Subscription</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4 pt-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Merchant Address</label>
                <Input value={merchant} onChange={(e) => setMerchant(e.target.value)} placeholder="0x..." required />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Amount (MUSD)</label>
                <Input value={amount} onChange={(e) => setAmount(e.target.value)} type="number" placeholder="100" required />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Interval (Days)</label>
                <Input value={interval} onChange={(e) => setIntervalDays(e.target.value)} type="number" placeholder="30" required />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Title/Description</label>
                <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Software License" required />
              </div>
              <Button type="submit" className="w-full mt-4">Create</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {subscriptions.length === 0 ? (
          <div className="col-span-full py-12 text-center border border-dashed border-border rounded-xl">
            <p className="text-muted-foreground">No active subscriptions found.</p>
          </div>
        ) : (
          subscriptions.map((sub) => (
            <Card key={sub._id} className={`border-border shadow-sm ${sub.status === 'paused' ? 'bg-secondary/20' : ''}`}>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex justify-between items-center">
                  {sub.title}
                  {sub.status === 'paused' && (
                    <span className="text-xs bg-yellow-500/20 text-yellow-500 px-2 py-1 rounded">Paused</span>
                  )}
                </CardTitle>
                <CardDescription className="font-mono text-xs">
                  To: {sub.merchantWallet.substring(0, 6)}...{sub.merchantWallet.substring(sub.merchantWallet.length - 4)}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className={`flex items-baseline gap-1 mb-4 ${sub.status === 'paused' ? 'opacity-50' : ''}`}>
                  <span className="text-3xl font-bold">{sub.amount}</span>
                  <span className="text-muted-foreground font-medium">MUSD</span>
                  <span className="text-sm text-muted-foreground ml-1">/ {sub.intervalDays} days</span>
                </div>
                <div className="flex items-center justify-between text-sm mb-6">
                  <span className="text-muted-foreground">Next payment:</span>
                  <span className="font-medium">{new Date(sub.nextPaymentDate).toLocaleDateString()}</span>
                </div>
                <div className="flex gap-2">
                  {sub.status === 'active' ? (
                    <Button onClick={() => handleUpdateStatus(sub._id, 'paused')} variant="outline" className="flex-1 gap-2 border-border text-yellow-500 hover:text-yellow-600">
                      <Pause size={16} /> Pause
                    </Button>
                  ) : (
                    <Button onClick={() => handleUpdateStatus(sub._id, 'active')} variant="outline" className="flex-1 gap-2 border-border text-green-500 hover:text-green-600">
                      <Play size={16} /> Resume
                    </Button>
                  )}
                  <Button onClick={() => handleDelete(sub._id, sub.onchainSubId)} variant="outline" className="px-3 border-border text-destructive hover:text-destructive">
                    <Trash2 size={16} />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
