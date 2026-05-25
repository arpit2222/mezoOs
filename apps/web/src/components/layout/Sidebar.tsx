'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, FileText, Repeat, Bot, Activity, Users, Settings } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Invoices', href: '/invoices', icon: FileText },
  { name: 'Subscriptions', href: '/subscriptions', icon: Repeat },
  { name: 'Automation', href: '/automation', icon: Settings },
  { name: 'Event Logs', href: '/events', icon: Activity },
  { name: 'Team', href: '/team', icon: Users },
  { name: 'AI Assistant', href: '/ai', icon: Bot },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r border-border bg-card h-[calc(100vh-4rem)] sticky top-16 flex flex-col">
      <div className="flex-1 py-6 px-4 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-sm font-medium",
                isActive 
                  ? "bg-secondary text-primary" 
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
              )}
            >
              <item.icon size={18} />
              {item.name}
            </Link>
          );
        })}
      </div>
      
      <div className="p-4 border-t border-border">
        <div className="bg-secondary/50 rounded-lg p-4">
          <p className="text-xs text-muted-foreground mb-2">Mezo Utility Tier</p>
          <div className="flex items-center justify-between">
            <span className="font-semibold text-primary">Pro Tier</span>
            <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded">Active</span>
          </div>
          <p className="text-[10px] text-muted-foreground mt-2">1,000 MEZO Locked</p>
        </div>
      </div>
    </aside>
  );
}
