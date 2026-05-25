import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <header className="h-20 border-b border-border flex items-center justify-between px-8">
        <h1 className="text-2xl font-bold text-primary tracking-tight">MezoOS</h1>
        <Link 
          href="/dashboard" 
          className="bg-primary text-primary-foreground px-6 py-2.5 rounded-lg font-medium hover:bg-primary/90 transition-colors"
        >
          Launch App
        </Link>
      </header>
      
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4">
        <div className="max-w-4xl space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary text-sm font-medium border border-border">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            Operate on Bitcoin without selling it
          </div>
          
          <h2 className="text-6xl md:text-8xl font-bold tracking-tighter">
            Bitcoin-Native <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-amber-200">
              Treasury OS
            </span>
          </h2>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Deposit BTC as collateral. Mint MUSD as your operating balance. 
            Run invoices, subscriptions, and payouts on the most secure network.
          </p>
          
          <div className="flex items-center justify-center gap-4 pt-4">
            <Link 
              href="/dashboard" 
              className="bg-primary text-primary-foreground px-8 py-4 rounded-xl font-medium text-lg hover:bg-primary/90 transition-transform hover:scale-105"
            >
              Enter Dashboard
            </Link>
          </div>
        </div>

        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl w-full text-left">
          <div className="bg-card p-6 rounded-2xl border border-border">
            <div className="w-12 h-12 bg-primary/20 text-primary rounded-xl flex items-center justify-center mb-4 text-2xl font-bold">₿</div>
            <h3 className="text-xl font-semibold mb-2">BTC Collateral</h3>
            <p className="text-muted-foreground">Keep your upside. Use your Bitcoin to mint MUSD without triggering taxable events.</p>
          </div>
          <div className="bg-card p-6 rounded-2xl border border-border">
            <div className="w-12 h-12 bg-primary/20 text-primary rounded-xl flex items-center justify-center mb-4 text-2xl font-bold">$</div>
            <h3 className="text-xl font-semibold mb-2">MUSD Operations</h3>
            <p className="text-muted-foreground">Pay vendors, manage subscriptions, and run your business with a stable operating balance.</p>
          </div>
          <div className="bg-card p-6 rounded-2xl border border-border">
            <div className="w-12 h-12 bg-primary/20 text-primary rounded-xl flex items-center justify-center mb-4 text-2xl font-bold">M</div>
            <h3 className="text-xl font-semibold mb-2">MEZO Utility</h3>
            <p className="text-muted-foreground">Lock MEZO to unlock premium automation rules, team treasury controls, and fee discounts.</p>
          </div>
        </div>
      </main>
      
      <footer className="mt-24 border-t border-border bg-card/50 py-12 px-8">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div>
            <h4 className="font-bold text-lg mb-2">MezoOS Contracts</h4>
            <p className="text-sm text-muted-foreground">Deployed on Mezo Testnet</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-2 text-sm">
            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">Mock MUSD:</span>
              <span className="font-mono text-primary">0xB07082...4Cef</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">Mock MEZO:</span>
              <span className="font-mono text-primary">0xaEAD54...8bd1</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">Treasury:</span>
              <span className="font-mono text-primary">0x1B1aB5...0a02</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">Invoice Mgr:</span>
              <span className="font-mono text-primary">0xcDC70B...3995</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">Subscriptions:</span>
              <span className="font-mono text-primary">0xdaa067...fB92</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">Utility Tier:</span>
              <span className="font-mono text-primary">0x20e61A...399f</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
