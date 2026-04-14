import { Users, ArrowLeftRight, Receipt, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export function FinanceTab() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Customer Debt Tracking */}
        <div className="rounded-lg border bg-card p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            <h3 className="font-display font-semibold">Customer Debt Tracker</h3>
          </div>
          <div className="space-y-2">
            {[
              { name: 'Mwangi Enterprises', amount: 'KES 340,000', due: '2026-04-15', overdue: false },
              { name: 'Accra Trading Co.', amount: 'GHS 28,500', due: '2026-03-20', overdue: true },
              { name: 'Kampala Supplies', amount: 'UGX 12,400,000', due: '2026-04-30', overdue: false },
              { name: 'Lusaka Wholesale', amount: 'ZMW 85,000', due: '2026-03-15', overdue: true },
            ].map((debt, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-md border">
                <div>
                  <p className="text-sm font-medium">{debt.name}</p>
                  <p className="text-xs text-muted-foreground">Due: {debt.due}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold">{debt.amount}</p>
                  {debt.overdue && (
                    <span className="inline-flex items-center gap-1 text-xs text-danger">
                      <AlertTriangle className="h-3 w-3" /> Overdue
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cross-Branch Lending */}
        <div className="rounded-lg border bg-card p-6 space-y-4">
          <div className="flex items-center gap-2">
            <ArrowLeftRight className="h-5 w-5 text-primary" />
            <h3 className="font-display font-semibold">Cross-Branch Lending</h3>
          </div>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-muted-foreground font-medium">Lending Branch</label>
              <select className="w-full mt-1 p-3 rounded-md border bg-card text-sm">
                <option>Ghana (GHS)</option>
                <option>Kenya (KES)</option>
                <option>Botswana (BWP)</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-muted-foreground font-medium">Receiving Branch</label>
              <select className="w-full mt-1 p-3 rounded-md border bg-card text-sm">
                <option>Zambia (ZMW)</option>
                <option>Malawi (MWK)</option>
                <option>Tanzania (TZS)</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-muted-foreground font-medium">Amount (USD Equivalent)</label>
              <input type="number" placeholder="0.00" className="w-full mt-1 p-3 rounded-md border bg-card text-sm" />
            </div>
            <Button className="w-full">Submit Loan Request</Button>
          </div>
        </div>
      </div>

      {/* Expense Log */}
      <div className="rounded-lg border bg-card p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Receipt className="h-5 w-5 text-primary" />
            <h3 className="font-display font-semibold">Expense Log</h3>
          </div>
          <Button size="sm">+ Add Expense</Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 text-xs text-muted-foreground font-medium">Date</th>
                <th className="text-left py-2 text-xs text-muted-foreground font-medium">Description</th>
                <th className="text-left py-2 text-xs text-muted-foreground font-medium">Branch</th>
                <th className="text-left py-2 text-xs text-muted-foreground font-medium">Amount</th>
                <th className="text-left py-2 text-xs text-muted-foreground font-medium">Receipt</th>
              </tr>
            </thead>
            <tbody>
              {[
                { date: '2026-03-31', desc: 'Warehouse Rent', branch: 'Kenya', amount: 'KES 45,000', receipt: true },
                { date: '2026-03-30', desc: 'Fuel - Delivery', branch: 'Ghana', amount: 'GHS 1,200', receipt: true },
                { date: '2026-03-29', desc: 'Staff Salary', branch: 'Uganda', amount: 'UGX 3,200,000', receipt: false },
              ].map((exp, i) => (
                <tr key={i} className="border-b">
                  <td className="py-3">{exp.date}</td>
                  <td className="py-3 font-medium">{exp.desc}</td>
                  <td className="py-3">{exp.branch}</td>
                  <td className="py-3">{exp.amount}</td>
                  <td className="py-3">
                    {exp.receipt ? (
                      <span className="text-xs text-success">✓ Uploaded</span>
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
