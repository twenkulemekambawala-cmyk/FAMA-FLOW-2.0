import { Outlet } from "react-router-dom";
import { Ship, DollarSign, ShoppingCart, LayoutDashboard, LogOut } from "lucide-react";
import { ApprovalRibbon } from "@/components/ApprovalRibbon";
import { NavLink } from "@/components/NavLink";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navItems = [
  { to: '/gm', label: 'GM Command Center', icon: LayoutDashboard },
  { to: '/gm/logistics', label: 'Logistics', icon: Ship },
  { to: '/gm/finance', label: 'Finance', icon: DollarSign },
  { to: '/gm/procurement', label: 'Procurement', icon: ShoppingCart },
];

export function AppLayout() {
  const { signOut, user } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <ApprovalRibbon />

      <header className="border-b bg-card px-4 lg:px-8 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-display font-bold text-sm">FF</span>
            </div>
            <div>
              <h1 className="font-display font-bold text-lg leading-none">FAMA FLOW</h1>
              <p className="text-xs text-muted-foreground">GM Command Center</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <select className="p-2 rounded-md border bg-card text-xs font-medium">
              <option>KES - Kenya</option>
              <option>GHS - Ghana</option>
              <option>BWP - Botswana</option>
              <option>MWK - Malawi</option>
              <option>NAD - Namibia</option>
              <option>RWF - Rwanda</option>
              <option>TZS - Tanzania</option>
              <option>UGX - Uganda</option>
              <option>ZMW - Zambia</option>
            </select>
            <span className="text-xs text-muted-foreground">{user?.email}</span>
            <Button variant="ghost" size="sm" onClick={signOut}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <nav className="border-b bg-card px-4 lg:px-8">
        <div className="max-w-7xl mx-auto flex gap-1 overflow-x-auto">
          {navItems.map(item => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/gm'}
                className={cn(
                  "flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors shrink-0",
                  "border-transparent text-muted-foreground hover:text-foreground"
                )}
                activeClassName="!border-primary !text-primary"
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </NavLink>
            );
          })}
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 lg:px-8 py-6">
        <Outlet />
      </main>
    </div>
  );
}
