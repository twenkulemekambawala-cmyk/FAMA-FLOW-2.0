import { CheckCircle, XCircle, Ship, Banknote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { pendingApprovals, getMarginColor } from "@/lib/data";
import { cn } from "@/lib/utils";

export function ApprovalQueue() {
  return (
    <div className="space-y-3">
      {pendingApprovals.map(item => {
        const marginStatus = item.margin !== undefined ? getMarginColor(item.margin) : null;
        const belowThreshold = item.margin !== undefined && item.margin < 12;

        return (
          <div key={item.id} className="flex items-center gap-4 p-3 rounded-lg border bg-card hover:shadow-sm transition-shadow">
            <div className={cn(
              "h-10 w-10 rounded-lg flex items-center justify-center shrink-0",
              item.type === 'logistics' ? "bg-primary/10 text-primary" : "bg-warning/10 text-warning"
            )}>
              {item.type === 'logistics' ? <Ship className="h-5 w-5" /> : <Banknote className="h-5 w-5" />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{item.title}</p>
              <p className="text-xs text-muted-foreground">{item.country} · {item.date}</p>
            </div>
            <div className="text-right shrink-0">
              <p className="text-sm font-semibold">{item.amount}</p>
              {item.margin !== undefined && (
                <p className={cn("text-xs font-medium",
                  marginStatus === 'success' && "text-success",
                  marginStatus === 'warning' && "text-warning",
                  marginStatus === 'danger' && "text-danger"
                )}>
                  Margin: {item.margin}%
                </p>
              )}
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <Button size="sm" className="h-8 px-3 text-xs" disabled={belowThreshold}>
                <CheckCircle className="h-3.5 w-3.5 mr-1" /> Approve
              </Button>
              <Button size="sm" variant="outline" className="h-8 px-3 text-xs">
                <XCircle className="h-3.5 w-3.5 mr-1" /> Reject
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
