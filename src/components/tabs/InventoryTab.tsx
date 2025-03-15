
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Package2,
  PackagePlus, 
  Truck, 
  AlertTriangle,
  DollarSign,
  Box,
  Boxes,
  ShoppingCart
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

export function InventoryTab() {
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
              All Items
            </NavigationMenuLink>
          </NavigationMenuItem>
          
          <NavigationMenuItem>
            <NavigationMenuLink
              className={navigationMenuTriggerStyle() + (activeCategory === "dental" ? " bg-accent" : "")}
              onClick={() => handleCategoryChange("dental")}
            >
              <Box className="h-4 w-4 mr-2" />
              Dental Supplies
            </NavigationMenuLink>
          </NavigationMenuItem>
          
          <NavigationMenuItem>
            <NavigationMenuLink
              className={navigationMenuTriggerStyle() + (activeCategory === "equipment" ? " bg-accent" : "")}
              onClick={() => handleCategoryChange("equipment")}
            >
              <Boxes className="h-4 w-4 mr-2" />
              Equipment
            </NavigationMenuLink>
          </NavigationMenuItem>
          
          <NavigationMenuItem>
            <NavigationMenuLink
              className={navigationMenuTriggerStyle() + (activeCategory === "orders" ? " bg-accent" : "")}
              onClick={() => handleCategoryChange("orders")}
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Orders
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">248</div>
              <Package2 className="h-5 w-5 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">12</div>
              <AlertTriangle className="h-5 w-5 text-amber-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">3</div>
              <Truck className="h-5 w-5 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">$24,550</div>
              <DollarSign className="h-5 w-5 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="flex items-center gap-4 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder={`Search ${activeCategory === "all" ? "inventory" : activeCategory}...`}
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
              {activeCategory === "all" ? "Inventory Items" : 
               activeCategory === "dental" ? "Dental Supplies" :
               activeCategory === "equipment" ? "Equipment" : "Order History"}
            </CardTitle>
            <Button size="sm">
              <PackagePlus className="h-4 w-4 mr-2" />
              Add Item
            </Button>
          </div>
          <CardDescription>
            {activeCategory === "orders" ? "Track orders and shipments" : "Manage your dental supplies and equipment"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <div className="p-4 text-center text-muted-foreground">
              {activeCategory === "all" ? "Inventory data" : 
               activeCategory === "dental" ? "Dental supplies" :
               activeCategory === "equipment" ? "Equipment" : "Order history"} will appear here
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
