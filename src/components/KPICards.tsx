import { Ship, Warehouse, DollarSign, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface KPICardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  variant?: 'default' | 'danger';
}

function KPICard({ title, value, subtitle, icon, variant = 'default' }: KPICardProps) {
  return (
    <div className={cn(
      "rounded-lg border p-4 sm:p-5 bg-card",
      variant === 'danger' && "border-danger/40 bg-danger/5"
    )}>
      <div className="flex items-center gap-3 sm:gap-4">
        <div className={cn(
          "h-11 w-11 sm:h-10 sm:w-10 rounded-lg flex items-center justify-center shrink-0",
          variant === 'danger' ? "bg-danger/10 text-danger" : "bg-primary/10 text-primary"
        )}>
          {icon}
        </div>
        <div className="min-w-0">
          <p className="text-xs text-muted-foreground font-medium">{title}</p>
          <p className="text-base sm:text-lg font-display font-bold break-words">{value}</p>
          {subtitle && <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>}
        </div>
      </div>
    </div>
  );
}

export function KPICards() {
  return (
    <div className="grid grid-cols-1 gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <KPICard title="On The Water" value="$284,500" subtitle="3 active shipments" icon={<Ship className="h-5 w-5" />} />
      <KPICard title="In Warehouse" value="$1,245,000" subtitle="Across 7 countries" icon={<Warehouse className="h-5 w-5" />} />
      <KPICard title="Group Liquidity" value="$892,300" subtitle="Total cash on hand" icon={<DollarSign className="h-5 w-5" />} />
      <KPICard title="Outstanding Debt" value="$438,200" subtitle="42 active accounts" variant="danger" icon={<AlertTriangle className="h-5 w-5" />} />
    </div>
  );
}
