'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Plus, Pause, Play, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

export default function SubscriptionsPage() {
  const [open, setOpen] = useState(false);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Subscription Created', {
      description: 'Your recurring payment has been set up successfully.',
    });
    setOpen(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Subscriptions</h1>
          <p className="text-muted-foreground">Manage your recurring MUSD obligations.</p>
        </div>
        
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus size={16} /> New Subscription
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] border-border bg-card">
            <DialogHeader>
              <DialogTitle>Create Subscription</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4 pt-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Merchant Address</label>
                <Input placeholder="0x..." required />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Amount (MUSD)</label>
                <Input type="number" placeholder="100" required />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Interval (Days)</label>
                <Input type="number" placeholder="30" required />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Title/Description</label>
                <Input placeholder="Software License" required />
              </div>
              <Button type="submit" className="w-full mt-4">Create</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Mock Active Subscription */}
        <Card className="border-border shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">OpenAI API</CardTitle>
            <CardDescription className="font-mono text-xs">To: 0xabc...def</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-1 mb-4">
              <span className="text-3xl font-bold">150</span>
              <span className="text-muted-foreground font-medium">MUSD</span>
              <span className="text-sm text-muted-foreground ml-1">/ 30 days</span>
            </div>
            <div className="flex items-center justify-between text-sm mb-6">
              <span className="text-muted-foreground">Next payment:</span>
              <span className="font-medium">June 15, 2026</span>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1 gap-2 border-border text-yellow-500 hover:text-yellow-600">
                <Pause size={16} /> Pause
              </Button>
              <Button variant="outline" className="px-3 border-border text-destructive hover:text-destructive">
                <Trash2 size={16} />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Mock Paused Subscription */}
        <Card className="border-border shadow-sm bg-secondary/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex justify-between items-center">
              Figma Seats
              <span className="text-xs bg-yellow-500/20 text-yellow-500 px-2 py-1 rounded">Paused</span>
            </CardTitle>
            <CardDescription className="font-mono text-xs">To: 0x123...456</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-1 mb-4 opacity-50">
              <span className="text-3xl font-bold">45</span>
              <span className="text-muted-foreground font-medium">MUSD</span>
              <span className="text-sm text-muted-foreground ml-1">/ 30 days</span>
            </div>
            <div className="flex gap-2 mt-11">
              <Button variant="outline" className="flex-1 gap-2 border-border text-green-500 hover:text-green-600">
                <Play size={16} /> Resume
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
