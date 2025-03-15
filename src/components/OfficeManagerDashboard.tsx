
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FollowUpsTab } from "@/components/tabs/FollowUpsTab";
import { InventoryTab } from "@/components/tabs/InventoryTab";
import { StaffTab } from "@/components/tabs/StaffTab";
import { BillingTab } from "@/components/tabs/BillingTab";

export function OfficeManagerDashboard() {
  return (
    <div className="space-y-4">
      <Tabs defaultValue="followups" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="followups">Follow-ups</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="staff">Staff Management</TabsTrigger>
          <TabsTrigger value="billing">Billing & Accounting</TabsTrigger>
        </TabsList>
        <TabsContent value="followups" className="mt-6">
          <FollowUpsTab />
        </TabsContent>
        <TabsContent value="inventory" className="mt-6">
          <InventoryTab />
        </TabsContent>
        <TabsContent value="staff" className="mt-6">
          <StaffTab />
        </TabsContent>
        <TabsContent value="billing" className="mt-6">
          <BillingTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
