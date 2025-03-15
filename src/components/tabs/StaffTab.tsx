
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  UserPlus, 
  Users, 
  Briefcase, 
  Badge, 
  Calendar,
  Search 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

  // Handle category change
  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    setSearchQuery("");
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
              <Calendar className="h-4 w-4 mr-2" />
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
      
      <div className="flex items-center gap-4 mb-4">
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
      </div>
      
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>
              {activeCategory === "all" ? "Staff Directory" : 
               activeCategory === "dentists" ? "Dentists" :
               activeCategory === "hygienists" ? "Hygienists" : "Staff Schedule"}
            </CardTitle>
            <Button size="sm">
              {activeCategory === "scheduling" ? (
                <>
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule Shift
                </>
              ) : (
                <>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add Staff
                </>
              )}
            </Button>
          </div>
          <CardDescription>
            {activeCategory === "scheduling" ? "Manage staff schedules and shifts" : "Manage your team and their information"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <div className="p-4 text-center text-muted-foreground">
              {activeCategory === "all" ? "Staff directory" : 
               activeCategory === "dentists" ? "Dentists directory" :
               activeCategory === "hygienists" ? "Hygienists directory" : "Staff schedule"} will appear here
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
