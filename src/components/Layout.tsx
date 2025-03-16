
import React from "react";
import { useLocation } from "react-router-dom";
import {
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";

export function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const hasSection = searchParams.has('section');
  const currentSection = searchParams.get('section');
  
  // Map section to title
  const getSectionTitle = () => {
    // If we're on the main dashboard (no section parameter)
    if (!hasSection && location.pathname === '/') {
      return "DentalTrack Dashboard";
    }
    
    // Otherwise, use the section-specific title
    switch (currentSection) {
      case "followups":
        return "Follow Ups";
      case "inventory":
        return "Inventory Management";
      case "staff":
        return "Staff Management";
      case "billing":
        return "Billing & Accounting";
      default:
        return "DentalTrack Dashboard";
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-dental-mint/20">
        <AppSidebar />
        <main className="flex-1 p-4 md:p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-dental-blue">{getSectionTitle()}</h1>
            <SidebarTrigger />
          </div>
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}
