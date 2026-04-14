import { CheckCircle, XCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { pendingApprovals } from "@/lib/data";

export function ApprovalRibbon() {
  const pending = pendingApprovals.filter(a => a.status === 'pending');

  if (pending.length === 0) return null;

  return (
    <div className="bg-primary text-primary-foreground px-4 py-2 flex items-center gap-4 overflow-x-auto">
      <div className="flex items-center gap-2 shrink-0">
        <Clock className="h-4 w-4" />
        <span className="text-sm font-semibold font-display">{pending.length} Pending Approvals</span>
      </div>
      <div className="h-4 w-px bg-primary-foreground/30" />
      <div className="flex items-center gap-3 overflow-x-auto">
        {pending.slice(0, 3).map(item => (
          <div key={item.id} className="flex items-center gap-2 shrink-0 text-sm">
            <span className="opacity-80">{item.title.slice(0, 25)}…</span>
            <Button size="sm" variant="secondary" className="h-6 px-2 text-xs bg-primary-foreground/20 hover:bg-primary-foreground/30 text-primary-foreground border-0">
              <CheckCircle className="h-3 w-3" />
            </Button>
            <Button size="sm" variant="secondary" className="h-6 px-2 text-xs bg-primary-foreground/10 hover:bg-primary-foreground/20 text-primary-foreground border-0">
              <XCircle className="h-3 w-3" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
