
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  DollarSign, 
  CreditCard, 
  Receipt, 
  FileText,
  Percent,
  Wallet,
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

export function BillingTab() {
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
              All Transactions
            </NavigationMenuLink>
          </NavigationMenuItem>
          
          <NavigationMenuItem>
            <NavigationMenuLink
              className={navigationMenuTriggerStyle() + (activeCategory === "payments" ? " bg-accent" : "")}
              onClick={() => handleCategoryChange("payments")}
            >
              <CreditCard className="h-4 w-4 mr-2" />
              Payments
            </NavigationMenuLink>
          </NavigationMenuItem>
          
          <NavigationMenuItem>
            <NavigationMenuLink
              className={navigationMenuTriggerStyle() + (activeCategory === "insurance" ? " bg-accent" : "")}
              onClick={() => handleCategoryChange("insurance")}
            >
              <FileText className="h-4 w-4 mr-2" />
              Insurance Claims
            </NavigationMenuLink>
          </NavigationMenuItem>
          
          <NavigationMenuItem>
            <NavigationMenuLink
              className={navigationMenuTriggerStyle() + (activeCategory === "invoices" ? " bg-accent" : "")}
              onClick={() => handleCategoryChange("invoices")}
            >
              <Receipt className="h-4 w-4 mr-2" />
              Invoices
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Revenue (MTD)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">$42,580</div>
              <DollarSign className="h-5 w-5 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Outstanding</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">$8,245</div>
              <Receipt className="h-5 w-5 text-amber-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Insurance Claims</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">36</div>
              <FileText className="h-5 w-5 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Payments Today</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">12</div>
              <CreditCard className="h-5 w-5 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="flex items-center gap-4 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder={`Search ${activeCategory === "all" ? "transactions" : activeCategory}...`}
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
              {activeCategory === "all" ? "Recent Transactions" : 
               activeCategory === "payments" ? "Payment History" :
               activeCategory === "insurance" ? "Insurance Claims" : "Invoices"}
            </CardTitle>
            <Button size="sm">
              {activeCategory === "insurance" ? (
                <>
                  <FileText className="h-4 w-4 mr-2" />
                  Submit Claim
                </>
              ) : activeCategory === "invoices" ? (
                <>
                  <Receipt className="h-4 w-4 mr-2" />
                  Create Invoice
                </>
              ) : (
                <>
                  <FileText className="h-4 w-4 mr-2" />
                  Generate Report
                </>
              )}
            </Button>
          </div>
          <CardDescription>
            {activeCategory === "insurance" ? "Track and manage insurance claims" : 
             activeCategory === "invoices" ? "Manage invoices and billing" :
             activeCategory === "payments" ? "Review payment history" : "Review recent financial transactions"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <div className="p-4 text-center text-muted-foreground">
              {activeCategory === "all" ? "Transaction data" : 
               activeCategory === "payments" ? "Payment history" :
               activeCategory === "insurance" ? "Insurance claims" : "Invoice data"} will appear here
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
