
import React from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  CheckCircle, 
  Package, 
  Users, 
  DollarSign,
  TrendingUp,
  Calendar
} from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { 
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { 
  ChartContainer, 
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent
} from "@/components/ui/chart";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Cell,
  ResponsiveContainer
} from "recharts";
import { useDashboardStats } from "@/services/openDentalApi";
import { Badge } from "@/components/ui/badge";

// Sample data for the dashboard charts and tables
const categoryData = [
  { name: "Follow-ups", value: 32, color: "#8B5CF6" },
  { name: "Inventory", value: 18, color: "#10B981" },
  { name: "Staff", value: 7, color: "#F59E0B" },
  { name: "Billing", value: 24, color: "#EF4444" }
];

const recentActivityData = [
  { type: "Follow-up", action: "Task completed", name: "Sarah Johnson", time: "10 minutes ago" },
  { type: "Inventory", action: "Item restocked", name: "Dental Acrylics", time: "30 minutes ago" },
  { type: "Billing", action: "Payment received", name: "Michael Chen", time: "1 hour ago" },
  { type: "Staff", action: "Shift changed", name: "Dr. Wilson", time: "2 hours ago" },
  { type: "Follow-up", action: "New task created", name: "Jessica Brown", time: "3 hours ago" }
];

export function SummaryDashboard() {
  const { data: stats, isLoading: statsLoading } = useDashboardStats();
  
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Office Overview</h2>
      
      {/* Top stat cards row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Today's Follow-ups" 
          value={statsLoading ? 0 : (stats?.todaysFollowUps || 0)} 
          icon={<CheckCircle className="h-5 w-5 text-purple-500" />}
          description="Patient callbacks"
          bgColor="bg-purple-50"
        />
        <StatCard 
          title="Inventory Status" 
          value={statsLoading ? 0 : (stats?.lowStockItems || 15)} 
          icon={<Package className="h-5 w-5 text-emerald-500" />}
          description="Items need reordering" 
          bgColor="bg-emerald-50"
        />
        <StatCard 
          title="Staff On Duty" 
          value={statsLoading ? 0 : (stats?.staffOnDuty || 7)} 
          icon={<Users className="h-5 w-5 text-amber-500" />}
          description="Active personnel" 
          bgColor="bg-amber-50"
        />
        <StatCard 
          title="Pending Payments" 
          value={statsLoading ? 0 : (stats?.pendingPayments || 24)} 
          icon={<DollarSign className="h-5 w-5 text-red-500" />}
          description="Needs processing" 
          bgColor="bg-red-50"
        />
      </div>
      
      {/* Charts and tables row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-muted-foreground" />
              Category Distribution
            </CardTitle>
            <CardDescription>Task distribution across departments</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ChartContainer 
              config={{
                followUps: { label: "Follow-ups", color: "#8B5CF6" },
                inventory: { label: "Inventory", color: "#10B981" },
                staff: { label: "Staff", color: "#F59E0B" },
                billing: { label: "Billing", color: "#EF4444" }
              }}
            >
              <BarChart data={categoryData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <ChartTooltip 
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="rounded-lg border bg-background p-2 shadow-sm">
                          <div className="font-semibold">{payload[0].name}</div>
                          <div className="text-xs text-muted-foreground">{`Count: ${payload[0].value}`}</div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
        
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              Recent Activity
            </CardTitle>
            <CardDescription>Latest actions across all departments</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Category</TableHead>
                  <TableHead>Activity</TableHead>
                  <TableHead>Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentActivityData.map((activity, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Badge variant="outline" className={
                        activity.type === "Follow-up" ? "bg-purple-50 text-purple-700 border-purple-200" :
                        activity.type === "Inventory" ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                        activity.type === "Staff" ? "bg-amber-50 text-amber-700 border-amber-200" :
                        "bg-red-50 text-red-700 border-red-200"
                      }>
                        {activity.type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{activity.action}</div>
                      <div className="text-sm text-muted-foreground">{activity.name}</div>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {activity.time}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
      
      {/* Summary Table */}
      <Card>
        <CardHeader>
          <CardTitle>Department Summary</CardTitle>
          <CardDescription>Overview of key metrics across departments</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Category</TableHead>
                <TableHead>Today's Count</TableHead>
                <TableHead>Pending</TableHead>
                <TableHead>Completed</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Follow-ups</TableCell>
                <TableCell>{statsLoading ? "Loading..." : (stats?.todaysFollowUps || 12)}</TableCell>
                <TableCell>{statsLoading ? "Loading..." : (stats?.pendingFollowUps || 4)}</TableCell>
                <TableCell>{statsLoading ? "Loading..." : (stats?.completedFollowUps || 8)}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    Good
                  </Badge>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Inventory</TableCell>
                <TableCell>{statsLoading ? "Loading..." : (stats?.todayInventoryUpdates || 5)}</TableCell>
                <TableCell>{statsLoading ? "Loading..." : (stats?.lowStockItems || 15)}</TableCell>
                <TableCell>{statsLoading ? "Loading..." : (stats?.restockedItems || 3)}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                    Attention
                  </Badge>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Staff</TableCell>
                <TableCell>{statsLoading ? "Loading..." : (stats?.staffOnDuty || 7)}</TableCell>
                <TableCell>{statsLoading ? "Loading..." : (stats?.pendingTimeOff || 2)}</TableCell>
                <TableCell>{statsLoading ? "Loading..." : (stats?.shiftsCompleted || 5)}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    Good
                  </Badge>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Billing</TableCell>
                <TableCell>{statsLoading ? "Loading..." : (stats?.todayTransactions || 18)}</TableCell>
                <TableCell>{statsLoading ? "Loading..." : (stats?.pendingPayments || 24)}</TableCell>
                <TableCell>{statsLoading ? "Loading..." : (stats?.clearedPayments || 12)}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                    Urgent
                  </Badge>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
