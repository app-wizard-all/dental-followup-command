
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UserPlus, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

export function StaffTab() {
  return (
    <div className="space-y-6">
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
      
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Staff Directory</CardTitle>
            <Button size="sm">
              <UserPlus className="h-4 w-4 mr-2" />
              Add Staff
            </Button>
          </div>
          <CardDescription>
            Manage your team and their schedules
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <div className="p-4 text-center text-muted-foreground">
              Staff directory will appear here
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
