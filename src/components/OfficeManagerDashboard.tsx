import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { FollowUpsTab } from "@/components/tabs/FollowUpsTab";
import { InventoryTab } from "@/components/tabs/InventoryTab";
import { StaffTab } from "@/components/tabs/StaffTab";
import { BillingTab } from "@/components/tabs/BillingTab";
import { Dashboard } from "@/components/Dashboard";

// Available sections that can be displayed
export type DashboardSection = "followups" | "inventory" | "staff" | "billing";

interface OfficeManagerDashboardProps {
  initialSection?: DashboardSection | null;
}

export function OfficeManagerDashboard({ initialSection = null }: OfficeManagerDashboardProps) {
  const [activeSection, setActiveSection] = useState<DashboardSection | null>(initialSection);
  const location = useLocation();
  
  // Update active section when URL changes
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const sectionParam = searchParams.get('section');
    
    if (sectionParam && ['followups', 'inventory', 'staff', 'billing'].includes(sectionParam)) {
      setActiveSection(sectionParam as DashboardSection);
    } else {
      setActiveSection(null); // No section parameter means we're on the main dashboard
    }
  }, [location]);

  // Function to render the active section content
  const renderSectionContent = () => {
    if (activeSection === null) {
      // If no section is specified, show the main dashboard
      return <Dashboard />;
    }
    
    // Otherwise, show the appropriate section
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
        return <Dashboard />;
    }
  };

  return (
    <div className="space-y-4">
      {renderSectionContent()}
    </div>
  );
}
