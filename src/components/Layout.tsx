
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
  const currentSection = searchParams.get('section') || "followups";
  
  // Map section to title
  const getSectionTitle = () => {
    switch (currentSection) {
      case "followups":
        return "Dental Follow-Up Center";
      case "inventory":
        return "Inventory Management";
      case "staff":
        return "Staff Management";
      case "billing":
        return "Billing & Accounting";
      default:
        return "Dental Follow-Up Center";
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
