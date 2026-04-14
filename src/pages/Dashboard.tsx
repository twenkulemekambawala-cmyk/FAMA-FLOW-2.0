import { KPICards } from "@/components/KPICards";
import { HealthMap } from "@/components/HealthMap";
import { ApprovalQueue } from "@/components/ApprovalQueue";

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <KPICards />
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3">
          <h2 className="font-display font-semibold text-base mb-3">Global Health Map</h2>
          <HealthMap />
        </div>
        <div className="lg:col-span-2">
          <h2 className="font-display font-semibold text-base mb-3">Approval Queue</h2>
          <ApprovalQueue />
        </div>
      </div>
    </div>
  );
}
