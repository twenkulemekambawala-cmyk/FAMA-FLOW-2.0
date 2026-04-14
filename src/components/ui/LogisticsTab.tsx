import { Ship, MapPin, Calculator, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { countries } from "@/lib/data";

export function LogisticsTab() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Logistics Planner */}
        <div className="rounded-lg border bg-card p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Ship className="h-5 w-5 text-primary" />
            <h3 className="font-display font-semibold">Logistics Planner</h3>
          </div>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-muted-foreground font-medium">Origin</label>
              <div className="flex items-center gap-2 mt-1 p-3 rounded-md bg-accent">
                <MapPin className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">China (Shanghai)</span>
              </div>
            </div>
            <div className="flex justify-center">
              <ArrowRight className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground font-medium">Destination Branch</label>
              <select className="w-full mt-1 p-3 rounded-md border bg-card text-sm">
                {countries.map(c => (
                  <option key={c.id} value={c.id}>{c.name} ({c.currencyCode})</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* CDM Calculator */}
        <div className="rounded-lg border bg-card p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Calculator className="h-5 w-5 text-primary" />
            <h3 className="font-display font-semibold">CDM Calculator</h3>
          </div>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-muted-foreground font-medium">China Payment (USD)</label>
              <input type="number" placeholder="0.00" className="w-full mt-1 p-3 rounded-md border bg-card text-sm" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground font-medium">Customs Duties (Local Currency)</label>
              <input type="number" placeholder="0.00" className="w-full mt-1 p-3 rounded-md border bg-card text-sm" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground font-medium">Port Fees (Local Currency)</label>
              <input type="number" placeholder="0.00" className="w-full mt-1 p-3 rounded-md border bg-card text-sm" />
            </div>
            <div className="p-3 rounded-md bg-accent">
              <p className="text-xs text-muted-foreground">Total Landed Cost (TLC)</p>
              <p className="text-lg font-display font-bold text-primary">KES 0</p>
            </div>
            <Button className="w-full">Request GM Approval</Button>
          </div>
        </div>
      </div>

      {/* Stock Movement */}
      <div className="rounded-lg border bg-card p-6 space-y-4">
        <h3 className="font-display font-semibold">Stock Movement Tracker</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 text-xs text-muted-foreground font-medium">Batch</th>
                <th className="text-left py-2 text-xs text-muted-foreground font-medium">From</th>
                <th className="text-left py-2 text-xs text-muted-foreground font-medium">To</th>
                <th className="text-left py-2 text-xs text-muted-foreground font-medium">Units</th>
                <th className="text-left py-2 text-xs text-muted-foreground font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="py-3 font-medium">#4518</td>
                <td className="py-3">Kenya (KES)</td>
                <td className="py-3">Uganda (UGX)</td>
                <td className="py-3">100</td>
                <td className="py-3"><span className="px-2 py-0.5 rounded-full text-xs bg-warning/10 text-warning font-medium">In Transit</span></td>
              </tr>
              <tr className="border-b">
                <td className="py-3 font-medium">#4515</td>
                <td className="py-3">China (USD)</td>
                <td className="py-3">Ghana (GHS)</td>
                <td className="py-3">250</td>
                <td className="py-3"><span className="px-2 py-0.5 rounded-full text-xs bg-success/10 text-success font-medium">Delivered</span></td>
              </tr>
              <tr>
                <td className="py-3 font-medium">#4520</td>
                <td className="py-3">China (USD)</td>
                <td className="py-3">Tanzania (TZS)</td>
                <td className="py-3">180</td>
                <td className="py-3"><span className="px-2 py-0.5 rounded-full text-xs bg-primary/10 text-primary font-medium">Clearing</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
