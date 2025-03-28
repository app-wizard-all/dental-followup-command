import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  UserPlus, 
  Users, 
  Briefcase, 
  Badge, 
  Calendar as CalendarIcon,
  Search,
  Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { TimeTrackingTab } from "@/components/staff/TimeTrackingTab";
import { StaffCalendarTab } from "@/components/staff/StaffCalendarTab";
import { useNavigate, useLocation } from "react-router-dom";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

export function StaffTab() {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  // Handle category change
  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    setSearchQuery("");
  };

  // Handle add staff button click
  const handleAddStaff = () => {
    // Create new search params keeping the role parameter
    const searchParams = new URLSearchParams(location.search);
    navigate(`/add-staff?${searchParams.toString()}`);
  };

  return (
    <div className="space-y-6">
      <NavigationMenu className="mb-2">
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuLink
              className={navigationMenuTriggerStyle() + (activeCategory === "all" ? " bg-accent" : "")}
              onClick={() => handleCategoryChange("all")}
            >
              All Staff
            </NavigationMenuLink>
          </NavigationMenuItem>
          
          <NavigationMenuItem>
            <NavigationMenuLink
              className={navigationMenuTriggerStyle() + (activeCategory === "dentists" ? " bg-accent" : "")}
              onClick={() => handleCategoryChange("dentists")}
            >
              <Badge className="h-4 w-4 mr-2" />
              Dentists
            </NavigationMenuLink>
          </NavigationMenuItem>
          
          <NavigationMenuItem>
            <NavigationMenuLink
              className={navigationMenuTriggerStyle() + (activeCategory === "hygienists" ? " bg-accent" : "")}
              onClick={() => handleCategoryChange("hygienists")}
            >
              <Briefcase className="h-4 w-4 mr-2" />
              Hygienists
            </NavigationMenuLink>
          </NavigationMenuItem>
          
          <NavigationMenuItem>
            <NavigationMenuLink
              className={navigationMenuTriggerStyle() + (activeCategory === "scheduling" ? " bg-accent" : "")}
              onClick={() => handleCategoryChange("scheduling")}
            >
              <CalendarIcon className="h-4 w-4 mr-2" />
              Scheduling
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Staff</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">12</div>
              <Users className="h-5 w-5 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">On Duty Today</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">8</div>
              <Users className="h-5 w-5 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Leave Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">2</div>
              <Users className="h-5 w-5 text-amber-500" />
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="flex items-center justify-between gap-4 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder={`Search ${activeCategory === "all" ? "staff" : activeCategory}...`}
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button onClick={handleAddStaff}>
          <UserPlus className="h-4 w-4 mr-2" />
          Add Staff
        </Button>
      </div>
      
      <Tabs defaultValue="time-tracking" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="time-tracking">
            <Clock className="h-4 w-4 mr-2" />
            Time Tracking
          </TabsTrigger>
          <TabsTrigger value="schedule">
            <CalendarIcon className="h-4 w-4 mr-2" />
            Staff Schedule
          </TabsTrigger>
        </TabsList>
        <TabsContent value="time-tracking" className="mt-4">
          <TimeTrackingTab />
        </TabsContent>
        <TabsContent value="schedule" className="mt-4">
          <StaffCalendarTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
