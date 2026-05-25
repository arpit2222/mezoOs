'use client';

import Script from 'next/script';
import { useState } from 'react';
import { CheckCircle2, PlayCircle, Loader2 } from 'lucide-react';

export default function DemoStorefront() {
  const [status, setStatus] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);

  const handleSubscribe = () => {
    // Check if SDK loaded
    if (typeof window !== 'undefined' && (window as any).MezoOS) {
      // 1. Initialize SDK with the merchant's API Key
      const mezo = new (window as any).MezoOS({ 
        apiKey: 'mz_test_demo', // Test API Key
        baseUrl: window.location.origin // Dynamic base URL for local testing
      });

      // 2. Trigger the checkout modal
      mezo.createSubscription({
        title: 'MezoFlix Premium',
        amount: 15,
        interval: 30 * 24 * 60 * 60, // 30 days in seconds
        onSuccess: (hash: string) => {
          setStatus('success');
          setTxHash(hash);
        },
        onCancel: () => {
          setStatus('cancelled');
        }
      });
    } else {
      alert('MezoOS SDK is still loading. Please try again in a moment.');
    }
  };

  return (
    <div className="min-h-screen bg-[#141414] text-white font-sans">
      {/* Load the vanilla JS SDK we built */}
      <Script src="/mezo-sdk.js" strategy="lazyOnload" />

      {/* Fake Navbar */}
      <nav className="flex items-center justify-between px-8 py-6">
        <div className="flex items-center gap-2 text-red-600 font-black text-3xl tracking-tighter">
          <PlayCircle size={32} />
          MEZOFLIX
        </div>
        <div className="text-sm font-medium hover:text-gray-300 cursor-pointer">Sign In</div>
      </nav>

      {/* Pricing Hero */}
      <main className="max-w-6xl mx-auto px-4 py-20 flex flex-col items-center">
        <h1 className="text-5xl font-bold text-center mb-4">Unlimited movies, TV shows, and more</h1>
        <p className="text-xl text-gray-400 text-center mb-12">Watch anywhere. Cancel anytime. Pay with Crypto.</p>

        {status === 'success' ? (
          <div className="bg-green-600/20 border border-green-500 rounded-2xl p-8 max-w-lg w-full text-center space-y-4">
            <CheckCircle2 size={64} className="text-green-500 mx-auto" />
            <h2 className="text-2xl font-bold">Welcome to Premium!</h2>
            <p className="text-gray-300">Your Web3 subscription is active.</p>
            <a 
              href={`https://explorer.test.mezo.org/tx/${txHash}`}
              target="_blank"
              rel="noreferrer"
              className="inline-block mt-4 text-green-400 hover:underline"
            >
              View on Mezo Explorer &rarr;
            </a>
          </div>
        ) : status === 'cancelled' ? (
          <div className="bg-red-600/20 border border-red-500 rounded-2xl p-8 max-w-lg w-full text-center space-y-4">
            <h2 className="text-2xl font-bold text-red-400">Checkout Cancelled</h2>
            <p className="text-gray-300">You can try subscribing again when you're ready.</p>
            <button 
              onClick={() => setStatus(null)}
              className="mt-4 px-6 py-2 bg-red-600 rounded font-medium hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-8 w-full max-w-4xl">
            {/* Standard Plan */}
            <div className="border border-gray-800 rounded-2xl p-8 bg-gray-900/50 hover:border-gray-700 transition-colors">
              <h3 className="text-2xl font-semibold mb-2">Standard</h3>
              <p className="text-gray-400 mb-6">Great video quality in 1080p.</p>
              <div className="text-4xl font-bold mb-8">$10 <span className="text-lg font-normal text-gray-500">/mo</span></div>
              <button className="w-full py-4 rounded font-bold bg-white text-black hover:bg-gray-200 transition-colors">
                Pay with Credit Card
              </button>
            </div>

            {/* Crypto Plan (Powered by MezoOS) */}
            <div className="border-2 border-orange-500 rounded-2xl p-8 bg-gradient-to-br from-orange-900/20 to-black relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                POPULAR IN WEB3
              </div>
              <h3 className="text-2xl font-semibold mb-2">Web3 Premium</h3>
              <p className="text-gray-400 mb-6">4K + HDR. Complete privacy.</p>
              <div className="text-4xl font-bold mb-8 flex items-baseline gap-2 text-orange-500">
                15 
                <span className="text-lg font-normal text-gray-400">MUSD / 30 days</span>
              </div>
              <button 
                onClick={handleSubscribe}
                className="w-full py-4 rounded font-bold bg-orange-600 text-white hover:bg-orange-500 transition-colors shadow-lg shadow-orange-900/50 flex items-center justify-center gap-2"
              >
                Subscribe with MezoOS
              </button>
              <p className="text-xs text-center text-gray-500 mt-4">
                Powered by Mezo Testnet Smart Contracts
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
