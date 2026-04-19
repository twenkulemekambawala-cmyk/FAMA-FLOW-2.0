import { useState } from "react";
import { Ship, DollarSign, ShoppingCart, LayoutDashboard, Menu, X, LogOut, User } from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'logistics', label: 'Logistics', icon: Ship },
  { id: 'finance', label: 'Finance', icon: DollarSign },
  { id: 'procurement', label: 'Sales', icon: ShoppingCart },
] as const;

type TabId = typeof tabs[number]['id'];

interface SidebarProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
  isMobileOpen: boolean;
  onMobileClose: () => void;
}

export function Sidebar({ activeTab, onTabChange, isMobileOpen, onMobileClose }: SidebarProps) {
  return (
    <>
      {/* Mobile overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onMobileClose}
          aria-hidden
        />
      )}
      
      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-[min(100vw-2rem,18rem)] max-w-[85vw] sm:w-64 bg-card border-r transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:inset-0 lg:max-w-none",
        "pl-[max(0px,env(safe-area-inset-left))] pt-[env(safe-area-inset-top)] lg:pl-0 lg:pt-0",
        isMobileOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full min-h-0">
          {/* Header */}
          <div className="flex items-center justify-between p-3 sm:p-4 border-b shrink-0">
            <img src="/logo.png" alt="FAMA Logo" className="h-10 w-auto" />
            <button
              type="button"
              onClick={onMobileClose}
              className="lg:hidden min-h-11 min-w-11 inline-flex items-center justify-center rounded-md hover:bg-accent touch-manipulation"
              aria-label="Close menu"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto overscroll-contain p-3 sm:p-4 space-y-1.5 sm:space-y-2">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  type="button"
                  key={tab.id}
                  onClick={() => {
                    onTabChange(tab.id);
                    onMobileClose();
                  }}
                  className={cn(
                    "w-full min-h-12 flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors touch-manipulation active:opacity-90",
                    activeTab === tab.id
                      ? "bg-primary text-primary-foreground"
                      : "text-[#414042] hover:text-foreground hover:bg-accent"
                  )}
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  {tab.label}
                </button>
              );
            })}
          </nav>

          {/* User section */}
          <div className="p-3 sm:p-4 border-t shrink-0 pb-[max(1rem,env(safe-area-inset-bottom))] lg:pb-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                <User className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-medium">Twen Kulemeka</p>
                <p className="text-xs text-muted-foreground">Admin</p>
              </div>
            </div>
            <button type="button" className="w-full min-h-11 flex items-center gap-3 px-3 py-3 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-colors touch-manipulation">
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
