
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, ClockIcon } from "lucide-react";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

// Mock data for employees
const employees = [
  { id: "1", name: "John Doe", role: "Dentist" },
  { id: "2", name: "Jane Smith", role: "Hygienist" },
  { id: "3", name: "Mike Johnson", role: "Office Manager" },
  { id: "4", name: "Sarah Williams", role: "Receptionist" },
  { id: "5", name: "David Brown", role: "Dental Assistant" },
];

export function TimeTrackingTab() {
  const [selectedEmployee, setSelectedEmployee] = useState<string>("");
  const [clockedIn, setClockedIn] = useState<boolean>(false);
  const [clockInTime, setClockInTime] = useState<Date | null>(null);
  const [clockOutTime, setClockOutTime] = useState<Date | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Reset time tracking when employee changes
    if (selectedEmployee) {
      setClockedIn(false);
      setClockInTime(null);
      setClockOutTime(null);
    }
  }, [selectedEmployee]);

  const handleClockIn = () => {
    if (!selectedEmployee) {
      toast({
        title: "Select Employee",
        description: "Please select an employee before clocking in.",
        variant: "destructive",
      });
      return;
    }

    const now = new Date();
    setClockInTime(now);
    setClockedIn(true);
    
    toast({
      title: "Clocked In",
      description: `${employees.find(e => e.id === selectedEmployee)?.name} clocked in at ${now.toLocaleTimeString()}`,
    });
  };

  const handleClockOut = () => {
    if (!selectedEmployee || !clockedIn) {
      toast({
        title: "Not Clocked In",
        description: "Cannot clock out. Employee is not clocked in.",
        variant: "destructive",
      });
      return;
    }

    const now = new Date();
    setClockOutTime(now);
    setClockedIn(false);
    
    toast({
      title: "Clocked Out",
      description: `${employees.find(e => e.id === selectedEmployee)?.name} clocked out at ${now.toLocaleTimeString()}`,
    });

    // Calculate hours worked
    if (clockInTime) {
      const hoursWorked = ((now.getTime() - clockInTime.getTime()) / 1000 / 60 / 60).toFixed(2);
      
      toast({
        title: "Shift Completed",
        description: `Hours worked: ${hoursWorked}`,
      });
    }
  };

  const formatTime = (date: Date | null) => {
    if (!date) return "Not set";
    return date.toLocaleTimeString();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Time Tracking</CardTitle>
        <CardDescription>Track employee work hours</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="employee-select" className="text-sm font-medium">Select Employee</label>
            <Select
              value={selectedEmployee}
              onValueChange={setSelectedEmployee}
            >
              <SelectTrigger id="employee-select" className="w-full">
                <SelectValue placeholder="Select an employee" />
              </SelectTrigger>
              <SelectContent>
                {employees.map((employee) => (
                  <SelectItem key={employee.id} value={employee.id}>
                    {employee.name} - {employee.role}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col items-center p-4 rounded-lg border">
              <div className="text-sm font-medium mb-2">Clock In</div>
              <ClockIcon className="h-8 w-8 mb-2 text-dental-teal" />
              <div className="text-sm mb-4">{clockInTime ? formatTime(clockInTime) : "Not clocked in"}</div>
              <Button 
                onClick={handleClockIn} 
                disabled={clockedIn || !selectedEmployee}
                className="w-full"
              >
                <Clock className="mr-2 h-4 w-4" />
                Clock In
              </Button>
            </div>

            <div className="flex flex-col items-center p-4 rounded-lg border">
              <div className="text-sm font-medium mb-2">Clock Out</div>
              <ClockIcon className="h-8 w-8 mb-2 text-dental-teal" />
              <div className="text-sm mb-4">{clockOutTime ? formatTime(clockOutTime) : "Not clocked out"}</div>
              <Button 
                onClick={handleClockOut} 
                disabled={!clockedIn || !selectedEmployee}
                className="w-full"
              >
                <Clock className="mr-2 h-4 w-4" />
                Clock Out
              </Button>
            </div>
          </div>
        </div>

        {selectedEmployee && (
          <div className="rounded-lg border p-4">
            <h3 className="text-sm font-medium mb-2">Current Status</h3>
            <div className="flex items-center">
              <div className={`h-3 w-3 rounded-full mr-2 ${clockedIn ? "bg-green-500" : "bg-red-500"}`}></div>
              <span className="text-sm">
                {clockedIn ? "Clocked In" : "Not Working"}
              </span>
            </div>
            {clockInTime && (
              <p className="text-xs text-muted-foreground mt-1">
                Clock in time: {formatTime(clockInTime)}
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
