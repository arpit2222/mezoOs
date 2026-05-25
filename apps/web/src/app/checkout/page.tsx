'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useWriteContract } from 'wagmi';
import { parseEther } from 'viem';
import { CONTRACT_ADDRESSES, RecurringPaymentsABI, ERC20ABI } from '@/config/contracts';
import { Loader2, ShieldCheck, X } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export default function CheckoutPage() {
  const searchParams = useSearchParams();
  const { address, isConnected } = useAccount();
  const { writeContractAsync } = useWriteContract();

  const [apiKey, setApiKey] = useState<string | null>(null);
  const [merchant, setMerchant] = useState<string | null>(null);
  const [amount, setAmount] = useState<string | null>(null);
  const [interval, setInterval] = useState<string | null>(null);
  const [title, setTitle] = useState<string | null>(null);

  const [step, setStep] = useState(0); // 0: idle, 1: approving, 2: subscribing, 3: success
  const [error, setError] = useState<string | null>(null);
  const [isResolving, setIsResolving] = useState(true);

  useEffect(() => {
    const key = searchParams.get('apiKey');
    setApiKey(key);
    setAmount(searchParams.get('amount'));
    setInterval(searchParams.get('interval'));
    setTitle(searchParams.get('title') || 'Subscription');

    if (key) {
      resolveApiKey(key);
    } else {
      setIsResolving(false);
      setError('Invalid API Key');
    }
  }, [searchParams]);

  const resolveApiKey = async (key: string) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://mezoos.onrender.com'}/api/keys/resolve/${key}`);
      if (!res.ok) throw new Error('Invalid or revoked API Key');
      const data = await res.json();
      setMerchant(data.merchantAddress);
    } catch (err) {
      console.error(err);
      setError('Invalid or revoked API Key');
    } finally {
      setIsResolving(false);
    }
  };

  const handleCancel = () => {
    if (window.parent) {
      window.parent.postMessage({ type: 'MEZO_CANCEL' }, '*');
    }
  };

  const handleSubscribe = async () => {
    if (!merchant || !amount || !interval) return;

    setError(null);
    try {
      // Step 1: Approve MUSD spending (12 cycles upfront for safety/MVP)
      setStep(1);
      const allowanceAmount = parseEther((Number(amount) * 12).toString());
      
      const approveTx = await writeContractAsync({
        address: CONTRACT_ADDRESSES.MockMUSD as `0x${string}`,
        abi: ERC20ABI,
        functionName: 'approve',
        args: [CONTRACT_ADDRESSES.RecurringPayments, allowanceAmount]
      });

      // Wait a moment for UX (ideally wait for tx receipt, but MVP we continue)
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Step 2: Create Subscription
      setStep(2);
      const subTx = await writeContractAsync({
        address: CONTRACT_ADDRESSES.RecurringPayments as `0x${string}`,
        abi: RecurringPaymentsABI,
        functionName: 'createSubscription',
        args: [
          merchant as `0x${string}`,
          parseEther(amount),
          BigInt(interval),
          title
        ]
      });

      setStep(3);
      
      // Notify parent window
      if (window.parent) {
        window.parent.postMessage({ type: 'MEZO_SUCCESS', txHash: subTx }, '*');
      }

    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Transaction failed');
      setStep(0);
    }
  };

  const formatInterval = (seconds: string) => {
    const days = parseInt(seconds) / (24 * 60 * 60);
    return `${days} days`;
  };

  if (isResolving || !amount || !interval) {
    return (
      <div className="flex h-screen items-center justify-center p-4 bg-background/95">
        <Card className="w-full h-full border-0 shadow-none bg-transparent flex flex-col items-center justify-center space-y-4">
          <Loader2 className="animate-spin text-primary" size={32} />
          <p className="text-muted-foreground text-sm font-medium animate-pulse">Authenticating merchant...</p>
        </Card>
      </div>
    );
  }

  if (error || !merchant) {
    return (
      <div className="flex h-screen items-center justify-center p-4 bg-background/95">
        <Card className="w-full max-w-sm p-6 flex flex-col items-center justify-center space-y-4 text-center">
          <X className="text-destructive w-12 h-12" />
          <h2 className="text-xl font-bold">Checkout Failed</h2>
          <p className="text-muted-foreground text-sm">{error || 'Invalid configuration.'}</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex h-screen items-center justify-center p-4 bg-background rounded-2xl overflow-hidden relative">
      {/* Background gradients for premium feel */}
      <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-primary/10 to-transparent pointer-events-none" />
      
      <button 
        onClick={handleCancel}
        className="absolute top-4 right-4 p-2 rounded-full hover:bg-secondary/80 text-muted-foreground transition-colors"
      >
        <X size={20} />
      </button>

      <div className="w-full max-w-sm z-10 flex flex-col h-full py-8">
        <div className="flex items-center justify-center gap-2 mb-8 text-primary">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-lg">M</span>
          </div>
          <span className="font-bold text-xl tracking-tight">MezoOS Checkout</span>
        </div>

        <div className="text-center mb-8">
          <p className="text-sm text-muted-foreground mb-1 uppercase tracking-wider font-semibold">{title}</p>
          <div className="flex items-end justify-center gap-1">
            <h2 className="text-4xl font-bold">{amount}</h2>
            <span className="text-lg font-medium text-muted-foreground mb-1">MUSD</span>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            every {formatInterval(interval)}
          </p>
        </div>

        <Card className="bg-secondary/30 border-border/50 mb-8 rounded-xl shadow-inner">
          <CardContent className="p-4 space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Merchant</span>
              <span className="font-mono text-xs">{merchant.slice(0, 6)}...{merchant.slice(-4)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Network</span>
              <span className="flex items-center gap-1 text-orange-500 font-medium">
                <ShieldCheck size={14} /> Mezo Testnet
              </span>
            </div>
          </CardContent>
        </Card>

        <div className="mt-auto space-y-4 flex flex-col items-center w-full">
          {error && (
            <div className="w-full p-3 bg-destructive/10 text-destructive text-sm rounded-lg border border-destructive/20 text-center">
              {error}
            </div>
          )}

          {!isConnected ? (
            <div className="w-full flex justify-center scale-110 origin-bottom">
              <ConnectButton />
            </div>
          ) : step === 3 ? (
            <div className="w-full p-4 bg-green-500/10 text-green-500 rounded-xl text-center flex flex-col items-center gap-2 border border-green-500/20">
              <ShieldCheck size={32} />
              <p className="font-bold text-lg">Payment Successful!</p>
              <p className="text-sm">You can close this window.</p>
            </div>
          ) : (
            <button
              onClick={handleSubscribe}
              disabled={step !== 0}
              className="w-full bg-primary text-primary-foreground py-4 rounded-xl font-bold text-lg shadow-[0_4px_14px_0_rgba(var(--primary),0.39)] hover:shadow-[0_6px_20px_rgba(var(--primary),0.23)] hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:hover:translate-y-0 disabled:hover:shadow-none flex items-center justify-center gap-2"
            >
              {step === 1 && <Loader2 size={20} className="animate-spin" />}
              {step === 2 && <Loader2 size={20} className="animate-spin" />}
              {step === 0 ? 'Subscribe Now' : step === 1 ? 'Approving MUSD...' : 'Creating Subscription...'}
            </button>
          )}

          <p className="text-xs text-center text-muted-foreground mt-4">
            Secured by smart contracts on the Mezo Network. Cancel anytime.
          </p>
        </div>
      </div>
    </div>
  );
}
