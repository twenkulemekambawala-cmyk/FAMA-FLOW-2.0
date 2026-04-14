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
          <div
            key={item.id}
            className="flex flex-col gap-3 p-4 rounded-lg border bg-card sm:flex-row sm:items-center sm:gap-4 sm:p-3 transition-shadow sm:hover:shadow-sm"
          >
            <div className="flex items-start gap-3 min-w-0 sm:items-center sm:flex-1">
              <div
                className={cn(
                  "h-11 w-11 rounded-lg flex items-center justify-center shrink-0",
                  item.type === 'logistics' ? "bg-primary/10 text-primary" : "bg-warning/10 text-warning"
                )}
              >
                {item.type === 'logistics' ? <Ship className="h-5 w-5" /> : <Banknote className="h-5 w-5" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium leading-snug sm:truncate">{item.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{item.country} · {item.date}</p>
              </div>
            </div>
            <div className="flex flex-col gap-2 sm:shrink-0 sm:text-right">
              <div>
                <p className="text-sm font-semibold">{item.amount}</p>
                {item.margin !== undefined && (
                  <p
                    className={cn(
                      "text-xs font-medium",
                      marginStatus === 'success' && "text-success",
                      marginStatus === 'warning' && "text-warning",
                      marginStatus === 'danger' && "text-danger"
                    )}
                  >
                    Margin: {item.margin}%
                  </p>
                )}
              </div>
              <div className="flex gap-2 w-full sm:w-auto sm:justify-end">
                <Button
                  size="sm"
                  className="h-11 flex-1 gap-1.5 text-xs sm:h-9 sm:flex-initial touch-manipulation inline-flex items-center justify-center"
                  disabled={belowThreshold}
                >
                  <CheckCircle className="h-4 w-4 shrink-0 sm:h-3.5 sm:w-3.5" />
                  Approve
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-11 flex-1 gap-1.5 text-xs sm:h-9 sm:flex-initial touch-manipulation inline-flex items-center justify-center"
                >
                  <XCircle className="h-4 w-4 shrink-0 sm:h-3.5 sm:w-3.5" />
                  Reject
                </Button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
