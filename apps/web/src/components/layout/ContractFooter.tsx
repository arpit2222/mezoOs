'use client';
import { Copy, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

const CONTRACTS = [
  { name: 'Mock MUSD', address: '0xB07082059231eBa9cf8d5A1E41f86a60b7334Cef' },
  { name: 'Mock MEZO', address: '0xaEAD54C9251D14113f9d71Fee95183751a6F8bd1' },
  { name: 'Treasury', address: '0x1B1aB51446fCEcBFF632FFCec769C55504E50a02' },
  { name: 'Invoice Mgr', address: '0xcDC70B86985CDF7dfC311d3c43fd5d9FF6023995' },
  { name: 'Subscriptions', address: '0xdaa0675bf1592FE3A0a822b0194bA2b9e9BFfB92' },
  { name: 'Utility Tier', address: '0x20e61A9CB6Bf904Af5F1374326bE426D3Fce399f' },
];

export function ContractFooter() {
  const handleCopy = (address: string) => {
    navigator.clipboard.writeText(address);
    toast.success('Contract address copied to clipboard');
  };

  const getExplorerLink = (address: string) => {
    return `https://explorer.test.mezo.org/address/${address}`;
  };

  const formatAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  return (
    <footer className="mt-24 border-t border-border bg-secondary/20 py-16 px-8">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-start gap-12">
        <div className="md:w-1/3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            Mezo Testnet
          </div>
          <h4 className="font-bold text-2xl mb-3">Smart Contracts</h4>
          <p className="text-muted-foreground leading-relaxed">
            MezoOS is built transparently on the Mezo network. You can verify and interact with all of our core contracts directly on the blockchain explorer.
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:w-2/3">
          {CONTRACTS.map((contract) => (
            <div 
              key={contract.name}
              className="bg-card border border-border p-4 rounded-xl flex items-center justify-between group hover:border-primary/50 transition-colors"
            >
              <div>
                <p className="text-sm font-medium text-foreground mb-1">{contract.name}</p>
                <p className="font-mono text-xs text-muted-foreground">{formatAddress(contract.address)}</p>
              </div>
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => handleCopy(contract.address)}
                  className="p-2 hover:bg-secondary rounded-md text-muted-foreground hover:text-foreground transition-colors"
                  title="Copy Address"
                >
                  <Copy size={14} />
                </button>
                <a 
                  href={getExplorerLink(contract.address)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 hover:bg-secondary rounded-md text-muted-foreground hover:text-foreground transition-colors"
                  title="View on Explorer"
                >
                  <ExternalLink size={14} />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </footer>
  );
}
