'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';

export default function InvoicesPage() {
  const { address } = useAccount();
  const [open, setOpen] = useState(false);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [amount, setAmount] = useState('');
  const [recipient, setRecipient] = useState('');
  const [memo, setMemo] = useState('');
  const [dueDate, setDueDate] = useState('');

  const fetchInvoices = async () => {
    if (!address) return;
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
      const res = await fetch(`${apiUrl}/api/invoices/${address}`);
      const data = await res.json();
      setInvoices(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, [address]);

  const handleCreateInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address) return toast.error('Please connect your wallet');
    
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
      await fetch(`${apiUrl}/api/invoices`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          senderWallet: address, 
          recipientWallet: recipient, 
          amount: Number(amount), 
          dueDate: new Date(dueDate), 
          memo 
        })
      });
      toast.success('Invoice Created', {
        description: `Invoice for ${amount} MUSD to ${recipient} created successfully.`,
      });
      setOpen(false);
      fetchInvoices();
    } catch (err) {
      toast.error('Failed to create invoice');
    }
  };

  const handlePay = async (id: string) => {
    toast.success('Payment Processing', {
      description: `Paying invoice... Check your wallet to confirm.`,
    });
    
    // Simulate MetaMask confirmation delay
    setTimeout(async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
        await fetch(`${apiUrl}/api/invoices/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: 'paid' })
        });
        toast.success(`Transaction confirmed! Invoice paid.`);
        fetchInvoices();
      } catch (err) {
        toast.error('Failed to update invoice status');
      }
    }, 1500);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Invoices</h1>
          <p className="text-muted-foreground">Manage accounts payable and receivable in MUSD.</p>
        </div>
        
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
            <Plus size={16} /> New Invoice
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] border-border bg-card">
            <DialogHeader>
              <DialogTitle>Create Invoice</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateInvoice} className="space-y-4 pt-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Recipient Wallet Address</label>
                <Input 
                  placeholder="0x..." 
                  value={recipient} 
                  onChange={(e) => setRecipient(e.target.value)} 
                  required 
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Amount (MUSD)</label>
                <Input 
                  type="number" 
                  placeholder="250" 
                  value={amount} 
                  onChange={(e) => setAmount(e.target.value)} 
                  required 
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Due Date</label>
                <Input 
                  type="date" 
                  value={dueDate} 
                  onChange={(e) => setDueDate(e.target.value)} 
                  required 
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Memo</label>
                <Input 
                  placeholder="Design retainer..." 
                  value={memo} 
                  onChange={(e) => setMemo(e.target.value)} 
                />
              </div>
              <Button type="submit" className="w-full mt-4">Generate Invoice</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="border-border">
        <CardHeader>
          <CardTitle>Recent Invoices</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead>ID</TableHead>
                <TableHead>Recipient</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                    No invoices found.
                  </TableCell>
                </TableRow>
              ) : (
                invoices.map((inv) => (
                  <TableRow key={inv._id} className="border-border">
                    <TableCell className="font-medium">{inv._id.substring(0, 8)}</TableCell>
                    <TableCell className="font-mono text-muted-foreground">
                      {inv.recipientWallet.substring(0, 6)}...{inv.recipientWallet.substring(inv.recipientWallet.length - 4)}
                    </TableCell>
                    <TableCell>{inv.amount} MUSD</TableCell>
                    <TableCell>{new Date(inv.dueDate).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        inv.status === 'paid' ? 'bg-green-500/20 text-green-500' : 'bg-yellow-500/20 text-yellow-500'
                      }`}>
                        {inv.status.toUpperCase()}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      {inv.status === 'pending' && inv.senderWallet === address && (
                        <Button variant="outline" size="sm" onClick={() => handlePay(inv._id)}>
                          Pay
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
