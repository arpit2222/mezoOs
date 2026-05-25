'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Key, Copy, Plus, Loader2, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

export default function DevelopersPage() {
  const { address, isConnected } = useAccount();
  const [keys, setKeys] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [keyName, setKeyName] = useState('');

  useEffect(() => {
    if (address) {
      fetchKeys();
    } else {
      setIsLoading(false);
      setKeys([]);
    }
  }, [address]);

  const fetchKeys = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://mezoos.onrender.com'}/api/keys/${address}`);
      const data = await res.json();
      setKeys(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch keys:', error);
      toast.error('Failed to load API keys');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateKey = async () => {
    if (!address) return toast.error('Connect wallet first');
    if (!keyName) return toast.error('Please enter a key name');
    
    try {
      setIsGenerating(true);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://mezoos.onrender.com'}/api/keys`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ merchantAddress: address, name: keyName })
      });
      const newKey = await res.json();
      setKeys([newKey, ...keys]);
      setKeyName('');
      toast.success('API Key generated successfully');
    } catch (error) {
      console.error('Failed to generate key:', error);
      toast.error('Failed to generate API key');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://mezoos.onrender.com'}/api/keys/${id}`, {
        method: 'DELETE'
      });
      setKeys(keys.filter(k => k._id !== id));
      toast.success('API Key revoked');
    } catch (error) {
      console.error('Failed to delete key:', error);
      toast.error('Failed to revoke key');
    }
  };

  const handleCopy = (key: string) => {
    navigator.clipboard.writeText(key);
    toast.success('API Key copied to clipboard!');
  };

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
        <Key size={48} className="text-muted-foreground opacity-20" />
        <h2 className="text-xl font-semibold">Connect your wallet</h2>
        <p className="text-muted-foreground">Please connect your wallet to manage API keys.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-4xl mx-auto">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Developer API Keys</h1>
          <p className="text-muted-foreground mt-2">Manage your API keys to integrate MezoOS into your own application.</p>
        </div>
        <Button variant="outline" onClick={() => window.location.href = '/docs'}>
          View Documentation
        </Button>
      </div>

      <Card className="border-border shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">Generate New Key</CardTitle>
          <CardDescription>Create a secret API key to authenticate requests from your backend or SDK.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 items-center">
            <input 
              type="text" 
              placeholder="e.g. Production Site, Test Environment"
              value={keyName}
              onChange={(e) => setKeyName(e.target.value)}
              className="flex-1 bg-background border border-border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <Button onClick={handleGenerateKey} disabled={isGenerating || !keyName} className="gap-2">
              {isGenerating ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
              Generate Key
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">Active Keys</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8 text-muted-foreground">
              <Loader2 className="animate-spin" />
            </div>
          ) : keys.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Key size={32} className="mx-auto mb-4 opacity-50" />
              <p>No API keys found. Generate one above to get started.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {keys.map((k) => (
                <div key={k._id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 rounded-xl border border-border bg-secondary/10 hover:bg-secondary/20 transition-colors gap-4">
                  <div>
                    <h4 className="font-semibold">{k.name}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <code className="text-xs bg-secondary px-2 py-1 rounded text-primary">
                        {k.apiKey}
                      </code>
                      <button onClick={() => handleCopy(k.apiKey)} className="text-muted-foreground hover:text-primary transition-colors">
                        <Copy size={14} />
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-xs text-muted-foreground">
                      Created {new Date(k.createdAt).toLocaleDateString()}
                    </span>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(k._id)} className="text-destructive hover:text-destructive hover:bg-destructive/10">
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
