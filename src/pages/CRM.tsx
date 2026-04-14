import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CustomerList } from "@/components/crm/CustomerList";
import { DealsPipeline } from "@/components/crm/DealsPipeline";

export default function CRM() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display font-bold text-xl">Customer Resource Management</h2>
        <p className="text-sm text-muted-foreground">Manage customers and track deals</p>
      </div>
      <Tabs defaultValue="customers">
        <TabsList>
          <TabsTrigger value="customers">Customers</TabsTrigger>
          <TabsTrigger value="pipeline">Sales Pipeline</TabsTrigger>
        </TabsList>
        <TabsContent value="customers" className="mt-4">
          <CustomerList />
        </TabsContent>
        <TabsContent value="pipeline" className="mt-4">
          <DealsPipeline />
        </TabsContent>
      </Tabs>
    </div>
  );
}
