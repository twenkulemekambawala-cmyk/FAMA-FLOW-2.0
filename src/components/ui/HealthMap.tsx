import { countries, formatCurrency } from "@/lib/data";
import { MarginDial } from "./MarginDial";
import { cn } from "@/lib/utils";

export function HealthMap() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {countries.map(country => (
        <div
          key={country.id}
          className={cn(
            "rounded-lg border p-4 bg-card transition-all hover:shadow-md cursor-pointer",
            country.status === 'critical' && "border-danger/50 bg-danger/5",
            country.status === 'warning' && "border-warning/50 bg-warning/5",
            country.status === 'healthy' && "border-success/30"
          )}
        >
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <h3 className="font-display font-semibold text-sm">{country.name}</h3>
              <p className="text-xs text-muted-foreground">{country.currencyCode}</p>
              <div className="pt-2 space-y-1">
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-muted-foreground">Cash:</span>
                  <span className="font-medium">{formatCurrency(country.cashOnHand, country.currencyCode)}</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-muted-foreground">Debt:</span>
                  <span className="font-medium text-danger">{formatCurrency(country.outstandingDebt, country.currencyCode)}</span>
                </div>
              </div>
            </div>
            <MarginDial margin={country.margin} size="sm" />
          </div>
        </div>
      ))}
    </div>
  );
}
