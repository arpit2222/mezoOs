import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Code2, Terminal, Rocket, ShieldCheck } from 'lucide-react';

export default function DocsPage() {
  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold mb-4">MezoOS Developer SDK</h1>
      <p className="text-muted-foreground mb-8">The easiest way to accept recurring crypto payments on the Mezo Network.</p>

      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-semibold mb-2">1. Include the SDK</h2>
          <div className="bg-secondary p-4 rounded-lg font-mono text-sm">
            {'<script src="https://mezoos.onrender.com/mezo-sdk.js"></script>'}
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-2">2. Initialize Checkout</h2>
          <div className="bg-secondary p-4 rounded-lg font-mono text-sm whitespace-pre">
            {`const mezo = new MezoOS({ apiKey: 'mz_test_your_secret_key' });\n\nmezo.createSubscription({\n  title: 'Pro Plan',\n  amount: 15,\n  interval: 2592000,\n  onSuccess: (txHash) => console.log('Success:', txHash)\n});`}
          </div>
        </div>
      </div>
    </div>
  );
}
