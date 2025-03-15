
import React, { useState } from "react";
import { FollowUpsTab } from "@/components/tabs/FollowUpsTab";
import { InventoryTab } from "@/components/tabs/InventoryTab";
import { StaffTab } from "@/components/tabs/StaffTab";
import { BillingTab } from "@/components/tabs/BillingTab";

// Available sections that can be displayed
export type DashboardSection = "followups" | "inventory" | "staff" | "billing";

interface OfficeManagerDashboardProps {
  initialSection?: DashboardSection;
}

export function OfficeManagerDashboard({ initialSection = "followups" }: OfficeManagerDashboardProps) {
  const [activeSection, setActiveSection] = useState<DashboardSection>(initialSection);

  // Function to render the active section content
  const renderSectionContent = () => {
    switch (activeSection) {
      case "followups":
        return <FollowUpsTab />;
      case "inventory":
        return <InventoryTab />;
      case "staff":
        return <StaffTab />;
      case "billing":
        return <BillingTab />;
      default:
        return <FollowUpsTab />;
    }
  };

  return (
    <div className="space-y-4">
      {renderSectionContent()}
    </div>
  );
}
