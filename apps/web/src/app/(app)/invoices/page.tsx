'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';

export default function InvoicesPage() {
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState('');
  const [recipient, setRecipient] = useState('');
  const [memo, setMemo] = useState('');
  const [dueDate, setDueDate] = useState('');

  const handleCreateInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch('http://localhost:4000/api/invoices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          senderWallet: '0x123...user', // Mock user wallet
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
    } catch (err) {
      toast.error('Failed to create invoice');
    }
  };

  const handlePay = (id: string) => {
    // Here we will eventually trigger smart contract
    toast.success('Payment Processing', {
      description: `Paying invoice ${id}... Check your wallet to confirm.`,
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Invoices</h1>
          <p className="text-muted-foreground">Manage accounts payable and receivable in MUSD.</p>
        </div>
        
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger render={<Button className="gap-2" />}>
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
              {/* Mock Data for now */}
              {[
                { id: 'INV-001', recipient: '0xabc...def', amount: 500, date: '2026-06-01', status: 'pending' },
                { id: 'INV-002', recipient: '0x123...456', amount: 1250, date: '2026-06-15', status: 'pending' },
                { id: 'INV-003', recipient: '0x789...012', amount: 250, date: '2026-05-20', status: 'paid' },
              ].map((inv) => (
                <TableRow key={inv.id} className="border-border">
                  <TableCell className="font-medium">{inv.id}</TableCell>
                  <TableCell className="font-mono text-muted-foreground">{inv.recipient}</TableCell>
                  <TableCell>{inv.amount} MUSD</TableCell>
                  <TableCell>{inv.date}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      inv.status === 'paid' ? 'bg-green-500/20 text-green-500' : 'bg-yellow-500/20 text-yellow-500'
                    }`}>
                      {inv.status.toUpperCase()}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    {inv.status === 'pending' && (
                      <Button variant="outline" size="sm" onClick={() => handlePay(inv.id)}>
                        Pay
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
