import { useState } from "react";
import { Menu } from "lucide-react";
import { Sidebar } from "@/components/Sidebar";
import { KPICards } from "@/components/KPICards";
import { HealthMap } from "@/components/HealthMap";
import { ApprovalQueue } from "@/components/ApprovalQueue";
import { LogisticsPage } from "@/components/LogisticsPage";
import { FinanceTab } from "@/components/FinanceTab";
import { ProcurementTab } from "@/components/ProcurementTab (1)";

type TabId = 'dashboard' | 'logistics' | 'finance' | 'procurement';

export default function Index() {
  const [activeTab, setActiveTab] = useState<TabId>('dashboard');
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div className="min-h-dvh bg-background flex overflow-x-hidden">
      <Sidebar 
        activeTab={activeTab} 
        onTabChange={setActiveTab}
        isMobileOpen={isMobileOpen}
        onMobileClose={() => setIsMobileOpen(false)}
      />
      
      <div className="flex-1 flex flex-col min-w-0 lg:ml-0">
        {/* Mobile Header */}
        <header className="lg:hidden border-b bg-card safe-pt sticky top-0 z-30">
          <div className="px-3 sm:px-4 pb-2 flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={() => setIsMobileOpen(true)}
              className="min-h-11 min-w-11 inline-flex items-center justify-center rounded-md hover:bg-accent active:bg-accent/80 touch-manipulation"
              aria-label="Open menu"
            >
              <Menu className="h-6 w-6" />
            </button>
            <div className="flex items-center gap-2 min-w-0">
              <img src="/logo.png" alt="FAMA Logo" className="h-8 w-auto" />
            </div>
            <div className="w-11 shrink-0" aria-hidden />
          </div>
          <div className="px-3 sm:px-4 pb-3">
            <label className="sr-only">Region currency</label>
            <select className="w-full min-h-11 rounded-md border bg-background px-3 text-sm font-medium touch-manipulation">
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
          </div>
        </header>

        {/* Desktop Header */}
        <header className="hidden lg:block border-b bg-card px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-display font-bold text-xl">
                {activeTab === 'dashboard' && 'Dashboard'}
                {activeTab === 'logistics' && 'Logistics'}
                {activeTab === 'finance' && 'Expenses'}
                {activeTab === 'procurement' && 'Clients'}
              </h1>
              <p className="text-sm text-muted-foreground">
                {activeTab === 'dashboard' && 'GM Command Center'}
                {activeTab === 'logistics' && 'Package Tracking & Management'}
                {activeTab === 'finance' && 'Financial Overview'}
                {activeTab === 'procurement' && 'Client Management'}
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm">
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
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 px-3 sm:px-4 lg:px-8 py-4 sm:py-6 safe-pb">
          {activeTab === 'dashboard' && (
            <div className="space-y-4 sm:space-y-6">
              <KPICards />
              <div className="grid grid-cols-1 xl:grid-cols-5 gap-4 sm:gap-6">
                <div className="xl:col-span-3 min-w-0">
                  <h2 className="font-display font-semibold text-base mb-2 sm:mb-3">Global Health Map</h2>
                  <HealthMap />
                </div>
                <div className="xl:col-span-2 min-w-0">
                  <h2 className="font-display font-semibold text-base mb-2 sm:mb-3">Approval Queue</h2>
                  <ApprovalQueue />
                </div>
              </div>
            </div>
          )}
          {activeTab === 'logistics' && <LogisticsPage />}
          {activeTab === 'finance' && <FinanceTab />}
          {activeTab === 'procurement' && <ProcurementTab />}
        </main>
      </div>
    </div>
  );
}
