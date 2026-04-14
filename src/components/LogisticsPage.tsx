import { useState } from "react";
import { Search, Plus, Package, CheckCircle, Circle, MapPin, Ship, Plane, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface PackageData {
  id: string;
  trackingId: string;
  client: string;
  description: string;
  cbm: string;
  weight: string;
  status: number;
  stages: {
    name: string;
    icon: typeof Package;
    completed: boolean;
    current: boolean;
  }[];
}

const mockPackages: PackageData[] = [
  {
    id: "1",
    trackingId: "PKG-2024-001",
    client: "Nairobi Distributors Ltd",
    description: "Electronics shipment - smartphones and accessories",
    cbm: "2.5",
    weight: "450kg",
    status: 3,
    stages: [
      { name: "Received in China", icon: Package, completed: true, current: false },
      { name: "Loaded in Container", icon: Package, completed: true, current: false },
      { name: "At Sea/Air", icon: Ship, completed: true, current: true },
      { name: "Arrived in Africa", icon: MapPin, completed: false, current: false },
      { name: "Delivered", icon: Truck, completed: false, current: false },
    ]
  },
  {
    id: "2", 
    trackingId: "PKG-2024-002",
    client: "Accra Retail Chain",
    description: "Textiles import - Batch #45B",
    cbm: "4.2",
    weight: "890kg",
    status: 2,
    stages: [
      { name: "Received in China", icon: Package, completed: true, current: false },
      { name: "Loaded in Container", icon: Package, completed: true, current: true },
      { name: "At Sea/Air", icon: Ship, completed: false, current: false },
      { name: "Arrived in Africa", icon: MapPin, completed: false, current: false },
      { name: "Delivered", icon: Truck, completed: false, current: false },
    ]
  },
  {
    id: "3",
    trackingId: "PKG-2024-003", 
    client: "Lusaka Logistics Co",
    description: "Emergency clearing fee documentation",
    cbm: "0.8",
    weight: "120kg",
    status: 4,
    stages: [
      { name: "Received in China", icon: Package, completed: true, current: false },
      { name: "Loaded in Container", icon: Package, completed: true, current: false },
      { name: "At Sea/Air", icon: Plane, completed: true, current: false },
      { name: "Arrived in Africa", icon: MapPin, completed: true, current: true },
      { name: "Delivered", icon: Truck, completed: false, current: false },
    ]
  }
];

export function LogisticsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredPackages = mockPackages.filter(pkg => {
    const matchesSearch = pkg.trackingId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pkg.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pkg.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || pkg.status.toString() === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:gap-4 sm:items-center sm:justify-between">
        <div className="w-full sm:flex-1 sm:max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              placeholder="Search packages..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 min-h-11"
            />
          </div>
        </div>
        <div className="flex flex-col gap-2 w-full sm:flex-row sm:w-auto">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full min-h-11 sm:w-40 touch-manipulation">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="1">Received</SelectItem>
              <SelectItem value="2">Loaded</SelectItem>
              <SelectItem value="3">In Transit</SelectItem>
              <SelectItem value="4">Arrived</SelectItem>
              <SelectItem value="5">Delivered</SelectItem>
            </SelectContent>
          </Select>
          <Button className="w-full min-h-11 sm:w-auto inline-flex items-center justify-center gap-2 touch-manipulation">
            <Plus className="h-4 w-4 shrink-0" />
            New Package
          </Button>
        </div>
      </div>

      {/* Packages List */}
      <div className="space-y-4">
        {filteredPackages.map((pkg) => (
          <Card key={pkg.id} className="overflow-hidden">
            <CardContent className="p-4 sm:p-6">
              <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
                {/* Package Info */}
                <div className="flex-1 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-lg">{pkg.trackingId}</h3>
                      <p className="text-sm text-muted-foreground">{pkg.client}</p>
                    </div>
                    <Badge variant={pkg.status >= 4 ? "default" : "secondary"}>
                      {pkg.status === 1 && "Received"}
                      {pkg.status === 2 && "Loaded"}
                      {pkg.status === 3 && "In Transit"}
                      {pkg.status === 4 && "Arrived"}
                      {pkg.status === 5 && "Delivered"}
                    </Badge>
                  </div>
                  
                  <p className="text-sm">{pkg.description}</p>
                  
                  <div className="flex gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">CBM:</span>
                      <span className="ml-1 font-medium">{pkg.cbm}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Weight:</span>
                      <span className="ml-1 font-medium">{pkg.weight}</span>
                    </div>
                  </div>
                </div>

                {/* Progress Tracker */}
                <div className="w-full lg:w-96 min-w-0">
                  <div className="touch-scroll-x -mx-1 px-1 pb-1">
                    <div className="flex items-center justify-between relative min-w-[280px] sm:min-w-0">
                      <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-border -translate-y-1/2" />
                      {pkg.stages.map((stage, index) => {
                        const Icon = stage.icon;
                        return (
                          <div key={index} className="relative z-10 flex flex-col items-center gap-1.5 sm:gap-2 shrink-0 w-14 sm:w-auto">
                            <div className={`w-9 h-9 sm:w-8 sm:h-8 rounded-full flex items-center justify-center ${
                              stage.completed 
                                ? "bg-primary text-primary-foreground" 
                                : "bg-muted text-muted-foreground"
                            }`}>
                              {stage.completed ? (
                                <CheckCircle className="h-4 w-4" />
                              ) : (
                                <Circle className="h-4 w-4" />
                              )}
                            </div>
                            <p className="text-[10px] sm:text-xs text-center max-w-[4.5rem] sm:max-w-20 leading-tight line-clamp-2 sm:line-clamp-none">
                              {stage.name}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredPackages.length === 0 && (
        <div className="text-center py-12">
          <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No packages found matching your criteria.</p>
        </div>
      )}
    </div>
  );
}
