'use client';

import { useState, useEffect } from 'react';
import { usePublicClient } from 'wagmi';
import { parseAbiItem, formatEther } from 'viem';
import { CONTRACT_ADDRESSES } from '@/config/contracts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Repeat, Star, Coins } from 'lucide-react';
import { toast } from 'sonner';

export default function EventsPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const publicClient = usePublicClient();

  useEffect(() => {
    const fetchEvents = async () => {
      if (!publicClient) return;
      try {
        setIsLoading(true);
        const currentBlock = await publicClient.getBlockNumber();
        // Fetch last 10000 blocks to avoid RPC rate limits on testnet
        const tenThousand = BigInt(10000);
        const zero = BigInt(0);
        const fromBlock = currentBlock - tenThousand > zero ? currentBlock - tenThousand : zero;

        // 1. Treasury Deposits
        const depositLogs = await publicClient.getLogs({
          address: CONTRACT_ADDRESSES.MezoTreasury as `0x${string}`,
          event: parseAbiItem('event CollateralDeposited(address indexed user, uint256 btcAmount, uint256 musdMinted, uint256 btcPrice)'),
          fromBlock,
          toBlock: 'latest'
        });

        // 2. Invoices Created & Paid
        const invCreatedLogs = await publicClient.getLogs({
          address: CONTRACT_ADDRESSES.InvoiceManager as `0x${string}`,
          event: parseAbiItem('event InvoiceCreated(uint256 indexed id, address indexed sender, address indexed recipient, uint256 amount, string memo, uint256 dueDate)'),
          fromBlock,
          toBlock: 'latest'
        });

        const invPaidLogs = await publicClient.getLogs({
          address: CONTRACT_ADDRESSES.InvoiceManager as `0x${string}`,
          event: parseAbiItem('event InvoicePaid(uint256 indexed id, address indexed sender, address indexed recipient, uint256 amount)'),
          fromBlock,
          toBlock: 'latest'
        });

        // Format and sort all logs
        const formattedEvents = [
          ...depositLogs.map(log => ({
            id: log.transactionHash,
            icon: Coins,
            color: 'text-orange-500',
            bg: 'bg-orange-500/20',
            title: 'Collateral Deposited',
            desc: `Deposited ${formatEther((log.args as any).btcAmount || zero)} BTC and minted ${formatEther((log.args as any).musdMinted || zero)} MUSD`,
            blockNumber: log.blockNumber
          })),
          ...invCreatedLogs.map(log => ({
            id: log.transactionHash,
            icon: FileText,
            color: 'text-blue-500',
            bg: 'bg-blue-500/20',
            title: `Invoice #${(log.args as any).id} Created`,
            desc: `Amount: ${formatEther((log.args as any).amount || zero)} MUSD`,
            blockNumber: log.blockNumber
          })),
          ...invPaidLogs.map(log => ({
            id: log.transactionHash,
            icon: FileText,
            color: 'text-green-500',
            bg: 'bg-green-500/20',
            title: `Invoice #${(log.args as any).id} Paid`,
            desc: `Amount: ${formatEther((log.args as any).amount || zero)} MUSD transferred`,
            blockNumber: log.blockNumber
          }))
        ];

        // Sort descending by block number
        formattedEvents.sort((a, b) => Number(b.blockNumber - a.blockNumber));
        setEvents(formattedEvents);
      } catch (err) {
        console.error('Error fetching logs:', err);
        toast.error('Failed to load real-time events from RPC');
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, [publicClient]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">On-Chain Event Logs</h1>
        <p className="text-muted-foreground">Live feed of smart contract events emitted on the Mezo Testnet.</p>
      </div>

      <Card className="border-border">
        <CardHeader>
          <CardTitle>Activity Feed</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {isLoading ? (
              <p className="text-center text-muted-foreground py-8">Fetching real-time on-chain logs...</p>
            ) : events.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No recent events found on-chain.</p>
            ) : (
              events.map((event) => (
                <div key={event.id} className="flex gap-4">
                  <div className={`mt-1 flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${event.bg}`}>
                    <event.icon size={18} className={event.color} />
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">{event.title}</p>
                      <span className="text-xs text-muted-foreground">Block #{event.blockNumber?.toString()}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{event.desc}</p>
                    <a 
                      href={`https://explorer.test.mezo.org/tx/${event.id}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-xs text-primary hover:underline"
                    >
                      View on Explorer ↗
                    </a>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
