import React from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useLocation, useNavigate } from "react-router-dom";

type UserRole = "officeManager" | "provider";

export function RoleSelector() {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const currentRole = searchParams.get("role") as UserRole || "officeManager";

  const handleRoleChange = (checked: boolean) => {
    const newRole = checked ? "provider" : "officeManager";
    
    // Create new search params keeping other params intact
    const newSearchParams = new URLSearchParams(location.search);
    newSearchParams.set("role", newRole);
    
    // Navigate to the same route but with new role
    navigate({
      pathname: location.pathname,
      search: newSearchParams.toString(),
    });
  };

  return (
    <div className="flex items-center space-x-4 bg-white p-3 rounded-lg shadow-sm border">
      <Label htmlFor="role-switch" className="font-medium">
        Office Manager
      </Label>
      <Switch 
        id="role-switch" 
        checked={currentRole === "provider"}
        onCheckedChange={handleRoleChange}
      />
      <Label htmlFor="role-switch" className="font-medium">
        Provider
      </Label>
    </div>
  );
}
