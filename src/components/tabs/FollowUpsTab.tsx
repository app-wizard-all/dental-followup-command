
import React, { useState } from "react";
import { TaskList } from "@/components/TaskList";
import { TaskForm } from "@/components/TaskForm";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Search, XCircle, FileCheck, Phone } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

export function FollowUpsTab() {
  const [filter, setFilter] = useState<"all" | "pending" | "completed" | "cancelled">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");

  // This function will be called when a task is created or the form is cancelled
  const handleTaskFormSave = () => {
    // This could refresh data or reset form state if needed
    console.log("Task form saved or cancelled");
  };

  // Handle category change
  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    // Reset search and filter when changing categories
    setSearchQuery("");
    setFilter("all");
  };

  return (
    <div className="grid gap-6">
      <NavigationMenu className="mb-2">
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuLink
              className={navigationMenuTriggerStyle() + (activeCategory === "all" ? " bg-accent" : "")}
              onClick={() => handleCategoryChange("all")}
            >
              All Follow-ups
            </NavigationMenuLink>
          </NavigationMenuItem>
          
          <NavigationMenuItem>
            <NavigationMenuLink
              className={navigationMenuTriggerStyle() + (activeCategory === "cancellation" ? " bg-accent" : "")}
              onClick={() => handleCategoryChange("cancellation")}
            >
              <XCircle className="h-4 w-4 mr-2" />
              Fill Cancellation
            </NavigationMenuLink>
          </NavigationMenuItem>
          
          <NavigationMenuItem>
            <NavigationMenuLink
              className={navigationMenuTriggerStyle() + (activeCategory === "post" ? " bg-accent" : "")}
              onClick={() => handleCategoryChange("post")}
            >
              <FileCheck className="h-4 w-4 mr-2" />
              Post Follow-up
            </NavigationMenuLink>
          </NavigationMenuItem>
          
          <NavigationMenuItem>
            <NavigationMenuLink
              className={navigationMenuTriggerStyle() + (activeCategory === "pharmacy" ? " bg-accent" : "")}
              onClick={() => handleCategoryChange("pharmacy")}
            >
              <Phone className="h-4 w-4 mr-2" />
              Pharmacy Calls
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
      
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

      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-2/3">
          <TaskList 
            filter={filter} 
            searchQuery={searchQuery} 
            category={activeCategory !== "all" ? activeCategory : undefined}
          />
        </div>
        <div className="w-full md:w-1/3">
          <TaskForm 
            onSave={handleTaskFormSave} 
            defaultCategory={activeCategory !== "all" ? activeCategory : undefined}
          />
        </div>
      </div>
    </div>
  );
}
