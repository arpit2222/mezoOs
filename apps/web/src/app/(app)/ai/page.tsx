'use client';
import { useState } from 'react';
import { Bot, Send, Sparkles } from 'lucide-react';

export default function AiAssistantPage() {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt) return;
    
    setLoading(true);
    try {
      // Connect to Express backend (port 4000)
      const res = await fetch('http://localhost:4000/api/ai/invoice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      });
      
      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error(err);
      // Fallback if backend is not running
      setResult({
        recipientWallet: "0x123...abc",
        amount: 250,
        dueDate: "2026-06-05",
        memo: "Fallback: Backend not running"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
          <Bot className="text-primary" size={24} />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">AI Treasury Assistant</h1>
          <p className="text-muted-foreground">Manage your treasury using natural language.</p>
        </div>
      </div>

      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
        <div className="p-6 border-b border-border bg-secondary/30 flex items-center gap-2">
          <Sparkles className="text-primary" size={18} />
          <h2 className="font-semibold">Generate Invoice</h2>
        </div>
        <div className="p-6 space-y-6">
          <form onSubmit={handleSubmit} className="relative">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., Create an invoice for 250 MUSD due next Friday for design retainer to 0x123..."
              className="w-full bg-secondary text-foreground rounded-xl pl-4 pr-12 py-4 outline-none focus:ring-2 focus:ring-primary border border-border transition-shadow"
            />
            <button 
              type="submit" 
              disabled={loading || !prompt}
              className="absolute right-2 top-2 bottom-2 bg-primary text-primary-foreground w-10 flex items-center justify-center rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-colors"
            >
              {loading ? <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" /> : <Send size={18} />}
            </button>
          </form>

          {result && (
            <div className="bg-secondary/50 p-6 rounded-xl border border-border animate-in slide-in-from-bottom-4">
              <h3 className="font-medium text-sm text-muted-foreground mb-4 uppercase tracking-wider">Generated Invoice Data</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Recipient</p>
                  <p className="font-mono text-sm">{result.recipientWallet}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Amount</p>
                  <p className="font-semibold">{result.amount} MUSD</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Due Date</p>
                  <p>{result.dueDate}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Memo</p>
                  <p>{result.memo}</p>
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <button className="px-4 py-2 rounded-lg text-sm font-medium hover:bg-secondary border border-border transition-colors">
                  Discard
                </button>
                <button className="bg-primary text-primary-foreground px-6 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
                  Create Invoice
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
          <h3 className="font-semibold flex items-center gap-2 mb-4">
            <Sparkles className="text-blue-400" size={18} />
            Treasury Summary
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Your treasury is currently <span className="text-green-400 font-medium">Healthy</span> with a 285% collateral factor. You have 12,450 MUSD available for operations. You have 2 pending invoices due this week totaling 1,500 MUSD. 
          </p>
          <button className="mt-4 text-primary text-sm font-medium hover:underline">
            Refresh Summary
          </button>
        </div>

        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
          <h3 className="font-semibold flex items-center gap-2 mb-4">
            <Sparkles className="text-purple-400" size={18} />
            Payment Assistant
          </h3>
          <div className="bg-secondary/50 rounded-lg p-4 border border-border">
            <div className="flex justify-between items-start mb-2">
              <p className="font-medium text-sm">Invoice #INV-004</p>
              <span className="text-xs bg-green-500/20 text-green-500 px-2 py-1 rounded font-medium">Pay Now</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Sufficient MUSD balance available. Paying now will not negatively impact your health factor or upcoming subscription obligations.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
