'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { FileText, Repeat, Settings, Star } from 'lucide-react';

const mockEvents = [
  { id: '1', type: 'invoice_paid', icon: FileText, color: 'text-green-500', bg: 'bg-green-500/20', title: 'Invoice Paid', desc: 'Paid 250 MUSD to 0x123...456', time: '2 mins ago' },
  { id: '2', type: 'subscription_created', icon: Repeat, color: 'text-blue-500', bg: 'bg-blue-500/20', title: 'Subscription Created', desc: 'Started 150 MUSD / 30 days to OpenAI', time: '1 hour ago' },
  { id: '3', type: 'mezo_tier_changed', icon: Star, color: 'text-primary', bg: 'bg-primary/20', title: 'Tier Upgraded', desc: 'Locked 1000 MEZO for Pro Tier', time: '3 hours ago' },
  { id: '4', type: 'automation_triggered', icon: Settings, color: 'text-purple-500', bg: 'bg-purple-500/20', title: 'Automation Executed', desc: 'Auto-paid Invoice #INV-003', time: '1 day ago' },
];

export default function EventsPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Event Logs</h1>
        <p className="text-muted-foreground">A unified feed of all blockchain and app activity.</p>
      </div>

      <Card className="border-border">
        <CardHeader>
          <CardTitle>Activity Feed</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {mockEvents.map((event) => (
              <div key={event.id} className="flex gap-4">
                <div className={`mt-1 flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${event.bg}`}>
                  <event.icon size={18} className={event.color} />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">{event.title}</p>
                    <span className="text-xs text-muted-foreground">{event.time}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{event.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
