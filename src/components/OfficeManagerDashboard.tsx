
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
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
  const location = useLocation();
  
  // Update active section when URL changes
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const sectionParam = searchParams.get('section');
    
    if (sectionParam && ['followups', 'inventory', 'staff', 'billing'].includes(sectionParam)) {
      setActiveSection(sectionParam as DashboardSection);
    }
  }, [location]);

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
