
import React, { useState } from "react";
import { TaskList } from "@/components/TaskList";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Search, XCircle, FileCheck, Phone, CheckCircle, Clock, AlertTriangle } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useFollowUpCounts } from "@/services/openDentalApi";

export function FollowUpsTab() {
  const [filter, setFilter] = useState<"all" | "pending" | "completed" | "cancelled">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const { data: followUpCounts, isLoading: countsLoading } = useFollowUpCounts();

  // Handle category change
  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    // Reset search and filter when changing categories
    setSearchQuery("");
    setFilter("all");
  };

  return (
    <div className="space-y-6">
      {/* Navigation Menu */}
      <NavigationMenu className="mb-2">
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuLink
              className={navigationMenuTriggerStyle() + (activeCategory === "all" ? " bg-dental-mint/50 text-dental-teal border-dental-teal/30" : "")}
              onClick={() => handleCategoryChange("all")}
            >
              All Follow-ups
            </NavigationMenuLink>
          </NavigationMenuItem>
          
          <NavigationMenuItem>
            <NavigationMenuLink
              className={navigationMenuTriggerStyle() + (activeCategory === "cancellation" ? " bg-dental-mint/50 text-dental-teal border-dental-teal/30" : "")}
              onClick={() => handleCategoryChange("cancellation")}
            >
              <XCircle className="h-4 w-4 mr-2" />
              Fill Cancellation
            </NavigationMenuLink>
          </NavigationMenuItem>
          
          <NavigationMenuItem>
            <NavigationMenuLink
              className={navigationMenuTriggerStyle() + (activeCategory === "post" ? " bg-dental-mint/50 text-dental-teal border-dental-teal/30" : "")}
              onClick={() => handleCategoryChange("post")}
            >
              <FileCheck className="h-4 w-4 mr-2" />
              Post Follow-up
            </NavigationMenuLink>
          </NavigationMenuItem>
          
          <NavigationMenuItem>
            <NavigationMenuLink
              className={navigationMenuTriggerStyle() + (activeCategory === "pharmacy" ? " bg-dental-mint/50 text-dental-teal border-dental-teal/30" : "")}
              onClick={() => handleCategoryChange("pharmacy")}
            >
              <Phone className="h-4 w-4 mr-2" />
              Pharmacy Calls
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
      
      {/* Dashboard Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending Follow-ups</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{countsLoading ? "..." : followUpCounts?.pendingFollowUps || 0}</div>
              <CheckCircle className="h-5 w-5 text-dental-teal" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Urgent Cases</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{countsLoading ? "..." : followUpCounts?.urgentTasks || 0}</div>
              <AlertTriangle className="h-5 w-5 text-amber-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Today's Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{countsLoading ? "..." : followUpCounts?.todaysFollowUps || 0}</div>
              <Clock className="h-5 w-5 text-dental-blue/70" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{countsLoading ? "..." : followUpCounts?.completedFollowUps || 0}</div>
              <CheckCircle className="h-5 w-5 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Search and Filters */}
      <div className="flex items-center gap-4 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder={`Search ${activeCategory === "all" ? "follow-ups" : activeCategory + " tasks"}...`}
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={filter} onValueChange={(value) => setFilter(value as any)}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Tasks</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {/* Task List Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>
              {activeCategory === "all" ? "Follow-up Tasks" : 
               activeCategory === "cancellation" ? "Cancellation Tasks" :
               activeCategory === "post" ? "Post Treatment Tasks" : "Pharmacy Call Tasks"}
            </CardTitle>
            <Button size="sm">
              <FileCheck className="h-4 w-4 mr-2" />
              Add Task
            </Button>
          </div>
          <CardDescription>
            {activeCategory === "all" ? "Manage all follow-up tasks" : 
             activeCategory === "cancellation" ? "Handle appointment cancellations" :
             activeCategory === "post" ? "Post-procedure follow-ups" : "Handle pharmacy calls and prescriptions"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TaskList 
            filter={filter} 
            searchQuery={searchQuery} 
            category={activeCategory !== "all" ? activeCategory : undefined}
          />
        </CardContent>
      </Card>
    </div>
  );
}
