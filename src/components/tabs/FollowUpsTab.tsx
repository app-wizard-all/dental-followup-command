
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "@/components/StatCard";

export function FollowUpsTab() {
  const [filter, setFilter] = useState<"all" | "pending" | "completed" | "cancelled">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");

  // Handle category change
  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    // Reset search and filter when changing categories
    setSearchQuery("");
    setFilter("all");
  };

  return (
    <div className="grid gap-6">
      {/* Dashboard Section for Follow-ups */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <StatCard 
          title="Pending Follow-ups" 
          value={12} 
          icon={<CheckCircle className="h-5 w-5 text-dental-teal" />}
          description="Needs attention"
          bgColor="bg-dental-mint/30"
        />
        <StatCard 
          title="Urgent Cases" 
          value={3} 
          icon={<AlertTriangle className="h-5 w-5 text-amber-500" />}
          description="High priority"
          bgColor="bg-amber-50"
        />
        <StatCard 
          title="Today's Tasks" 
          value={8} 
          icon={<Clock className="h-5 w-5 text-dental-blue/70" />}
          description="Due today"
          bgColor="bg-dental-lightBlue/40"
        />
      </div>
      
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg text-dental-gray">Follow-up Categories</CardTitle>
        </CardHeader>
        <CardContent>
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
        </CardContent>
      </Card>
      
      <div className="flex items-center gap-4">
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

      <div>
        <TaskList 
          filter={filter} 
          searchQuery={searchQuery} 
          category={activeCategory !== "all" ? activeCategory : undefined}
        />
      </div>
    </div>
  );
}
