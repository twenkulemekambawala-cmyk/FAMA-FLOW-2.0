import { useState } from "react";
import { Ship, MapPin, Package, TrendingUp, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { countries } from "@/lib/data";

const CONTAINER_MAX = 68;
const isFCL = (cbm: number) => cbm >= 50;

type ShippingMode = 'FCL' | 'LCL';
type ShipmentStatus = 'IN_CONSOLIDATION_QUEUE' | 'READY_FOR_PROCUREMENT';

export function LogisticsTab() {
  const [totalCBM, setTotalCBM] = useState<number>(0);
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [showInternalTransfers, setShowInternalTransfers] = useState<boolean>(false);

  const shippingMode: ShippingMode = isFCL(totalCBM) ? 'FCL' : 'LCL';
  const progressPercentage = (totalCBM / CONTAINER_MAX) * 100;

  const handleApprovalRequest = () => {
    const status: ShipmentStatus = shippingMode === 'LCL' 
      ? 'IN_CONSOLIDATION_QUEUE' 
      : 'READY_FOR_PROCUREMENT';
    
    console.log(`Shipment status set to: ${status}`);
    // TODO: Implement backend logic to update shipment status
    // TODO: For LCL, add to consolidation queue
    // TODO: For FCL, mark as ready for procurement
  };
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Logistics Planner */}
        <div className="rounded-lg border bg-white p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Ship className="h-5 w-5 text-red-700" />
            <h3 className="font-display font-semibold text-slate-800">Logistics Planner</h3>
          </div>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-slate-600 font-medium">Origin</label>
              <div className="flex items-center gap-2 mt-1 p-3 rounded-md bg-gray-50">
                <MapPin className="h-4 w-4 text-red-700" />
                <span className="text-sm font-medium text-slate-800">China (Shanghai)</span>
              </div>
            </div>
            <div>
              <label className="text-xs text-slate-600 font-medium">Total CBM</label>
              <input 
                type="number" 
                placeholder="0.00" 
                value={totalCBM || ''}
                onChange={(e) => setTotalCBM(parseFloat(e.target.value) || 0)}
                className="w-full mt-1 p-3 rounded-md border bg-white text-sm text-slate-800" 
              />
            </div>
            <div>
              <label className="text-xs text-slate-600 font-medium">Destination Branch</label>
              <select 
                className="w-full mt-1 p-3 rounded-md border bg-white text-sm text-slate-800"
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
              >
                <option value="">Select destination</option>
                {countries.map(c => (
                  <option key={c.id} value={c.id}>{c.name} ({c.currencyCode})</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Shipment Intelligence */}
        <div className="rounded-lg border bg-white p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Package className="h-5 w-5 text-red-700" />
            <h3 className="font-display font-semibold text-slate-800">Shipment Intelligence</h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-600 font-medium">Shipping Mode</p>
                <p className={`text-lg font-display font-bold ${
                  shippingMode === 'FCL' ? 'text-green-600' : 'text-orange-500'
                }`}>
                  {shippingMode === 'FCL' ? 'FCL - Direct Ship' : 'LCL - Groupage Required'}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {shippingMode === 'FCL' ? (
                  <TrendingUp className="h-5 w-5 text-green-600" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-orange-500" />
                )}
              </div>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs text-slate-600 font-medium">Container Usage</span>
                <span className="text-xs text-slate-800 font-medium">{totalCBM} / {CONTAINER_MAX} CBM</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${
                    shippingMode === 'FCL' ? 'bg-green-600' : 'bg-orange-500'
                  }`}
                  style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                />
              </div>
            </div>

            <div className="p-3 rounded-md bg-gray-50">
              <p className="text-xs text-slate-600">Container Status</p>
              <p className={`text-sm font-display font-bold ${
                shippingMode === 'FCL' ? 'text-green-600' : 'text-orange-500'
              }`}>
                {shippingMode === 'FCL' 
                  ? `Full Container Load (${totalCBM} CBM)`
                  : `Less than Container Load (${totalCBM} CBM)`
                }
              </p>
            </div>
            
            <Button 
              onClick={handleApprovalRequest}
              className="w-full bg-red-700 hover:bg-red-800 text-white"
              disabled={!totalCBM || !selectedCountry}
            >
              Request GM Approval
            </Button>
          </div>
        </div>
      </div>

      {/* Internal Transfers Collapsible Section */}
      <div className="rounded-lg border bg-white">
        <div 
          className="p-6 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors"
          onClick={() => setShowInternalTransfers(!showInternalTransfers)}
        >
          <h3 className="font-display font-semibold text-slate-800">Internal Transfers</h3>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-600">Stock Movement Tracker</span>
            <Package className={`h-4 w-4 text-red-700 transition-transform ${
              showInternalTransfers ? 'rotate-180' : ''
            }`} />
          </div>
        </div>
        
        {showInternalTransfers && (
          <div className="px-6 pb-6">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 text-xs text-slate-600 font-medium">Batch</th>
                    <th className="text-left py-2 text-xs text-slate-600 font-medium">From</th>
                    <th className="text-left py-2 text-xs text-slate-600 font-medium">To</th>
                    <th className="text-left py-2 text-xs text-slate-600 font-medium">Units</th>
                    <th className="text-left py-2 text-xs text-slate-600 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="py-3 font-medium text-slate-800">#4518</td>
                    <td className="py-3 text-slate-800">Kenya (KES)</td>
                    <td className="py-3 text-slate-800">Uganda (UGX)</td>
                    <td className="py-3 text-slate-800">100</td>
                    <td className="py-3"><span className="px-2 py-0.5 rounded-full text-xs bg-orange-100 text-orange-600 font-medium">In Transit</span></td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 font-medium text-slate-800">#4515</td>
                    <td className="py-3 text-slate-800">China (USD)</td>
                    <td className="py-3 text-slate-800">Ghana (GHS)</td>
                    <td className="py-3 text-slate-800">250</td>
                    <td className="py-3"><span className="px-2 py-0.5 rounded-full text-xs bg-green-100 text-green-600 font-medium">Delivered</span></td>
                  </tr>
                  <tr>
                    <td className="py-3 font-medium text-slate-800">#4520</td>
                    <td className="py-3 text-slate-800">China (USD)</td>
                    <td className="py-3 text-slate-800">Tanzania (TZS)</td>
                    <td className="py-3 text-slate-800">180</td>
                    <td className="py-3"><span className="px-2 py-0.5 rounded-full text-xs bg-red-100 text-red-700 font-medium">Clearing</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
