
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";

// Mock data for staff schedule
const staffSchedule = [
  {
    date: new Date(2024, 4, 1), // May 1, 2024
    staff: [
      { id: "1", name: "John Doe", role: "Dentist" },
      { id: "2", name: "Jane Smith", role: "Hygienist" },
      { id: "4", name: "Sarah Williams", role: "Receptionist" },
    ],
  },
  {
    date: new Date(2024, 4, 2), // May 2, 2024
    staff: [
      { id: "1", name: "John Doe", role: "Dentist" },
      { id: "3", name: "Mike Johnson", role: "Office Manager" },
      { id: "5", name: "David Brown", role: "Dental Assistant" },
    ],
  },
  {
    date: new Date(2024, 4, 3), // May 3, 2024
    staff: [
      { id: "2", name: "Jane Smith", role: "Hygienist" },
      { id: "3", name: "Mike Johnson", role: "Office Manager" },
      { id: "4", name: "Sarah Williams", role: "Receptionist" },
    ],
  },
  {
    date: new Date(2024, 4, 8), // May 8, 2024
    staff: [
      { id: "1", name: "John Doe", role: "Dentist" },
      { id: "2", name: "Jane Smith", role: "Hygienist" },
      { id: "5", name: "David Brown", role: "Dental Assistant" },
    ],
  },
  {
    date: new Date(2024, 4, 9), // May 9, 2024
    staff: [
      { id: "1", name: "John Doe", role: "Dentist" },
      { id: "3", name: "Mike Johnson", role: "Office Manager" },
      { id: "4", name: "Sarah Williams", role: "Receptionist" },
    ],
  },
  {
    date: new Date(2024, 4, 10), // May 10, 2024
    staff: [
      { id: "2", name: "Jane Smith", role: "Hygienist" },
      { id: "3", name: "Mike Johnson", role: "Office Manager" },
      { id: "5", name: "David Brown", role: "Dental Assistant" },
    ],
  },
];

interface StaffMember {
  id: string;
  name: string;
  role: string;
}

export function StaffCalendarTab() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedDateStaff, setSelectedDateStaff] = useState<StaffMember[]>([]);

  // Filter staff by role color
  const getStaffBadgeClass = (role: string) => {
    switch(role) {
      case "Dentist":
        return "bg-blue-500 hover:bg-blue-600";
      case "Hygienist":
        return "bg-green-500 hover:bg-green-600";
      case "Office Manager":
        return "bg-purple-500 hover:bg-purple-600";
      case "Receptionist":
        return "bg-orange-500 hover:bg-orange-600";
      case "Dental Assistant":
        return "bg-pink-500 hover:bg-pink-600";
      default:
        return "bg-gray-500 hover:bg-gray-600";
    }
  };

  // Custom day renderer to show staff count
  const renderDay = (day: Date) => {
    const dateString = day.toDateString();
    const scheduleForDay = staffSchedule.find(
      (s) => s.date.toDateString() === dateString
    );

    return scheduleForDay ? (
      <div className="relative">
        <div>{day.getDate()}</div>
        <div className="absolute -bottom-1 left-0 right-0 flex justify-center">
          <span className="h-1.5 w-1.5 rounded-full bg-dental-teal"></span>
          {scheduleForDay.staff.length > 1 && (
            <span className="h-1.5 w-1.5 rounded-full bg-dental-teal mx-0.5"></span>
          )}
          {scheduleForDay.staff.length > 2 && (
            <span className="h-1.5 w-1.5 rounded-full bg-dental-teal"></span>
          )}
        </div>
      </div>
    ) : (
      day.getDate()
    );
  };

  // Handle date change
  const handleSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    if (selectedDate) {
      const dateString = selectedDate.toDateString();
      const scheduleForDay = staffSchedule.find(
        (s) => s.date.toDateString() === dateString
      );
      setSelectedDateStaff(scheduleForDay?.staff || []);
    } else {
      setSelectedDateStaff([]);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Staff Schedule</CardTitle>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleSelect}
            className="rounded-md border"
            components={{
              Day: ({ date: dayDate, ...props }) => (
                <div {...props}>
                  {renderDay(dayDate)}
                </div>
              ),
            }}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            {date ? `Staff for ${date.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}` : 'Select a date'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {selectedDateStaff.length > 0 ? (
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {selectedDateStaff.map((staff) => (
                  <Badge 
                    key={staff.id} 
                    className={`${getStaffBadgeClass(staff.role)}`}
                  >
                    {staff.name} - {staff.role}
                  </Badge>
                ))}
              </div>
              <div className="text-sm text-muted-foreground">
                {selectedDateStaff.length} staff members scheduled
              </div>
            </div>
          ) : (
            <div className="py-8 text-center text-muted-foreground">
              {date ? 'No staff scheduled for this day' : 'Select a date to view scheduled staff'}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
