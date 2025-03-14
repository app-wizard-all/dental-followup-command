
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Phone, 
  Mail, 
  CheckCircle, 
  AlertCircle, 
  Clock,
  XCircle,
  Calendar,
  MoreHorizontal 
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";

// Sample follow-up tasks data
const initialTasks = [
  { 
    id: 1, 
    patientName: "Sarah Johnson", 
    followUpType: "cancellation", 
    dueDate: "2023-06-15", 
    status: "pending", 
    priority: "high",
    contactInfo: "(555) 123-4567",
    notes: "Patient requested a call back to reschedule."
  },
  { 
    id: 2, 
    patientName: "Michael Chen", 
    followUpType: "reschedule", 
    dueDate: "2023-06-16", 
    status: "pending", 
    priority: "medium",
    contactInfo: "(555) 987-6543",
    notes: "Patient needs to reschedule due to work conflict."
  },
  { 
    id: 3, 
    patientName: "Emily Williams", 
    followUpType: "treatment", 
    dueDate: "2023-06-15", 
    status: "completed", 
    priority: "medium",
    contactInfo: "(555) 456-7890",
    notes: "Called to check on recovery after wisdom tooth extraction."
  },
  { 
    id: 4, 
    patientName: "David Taylor", 
    followUpType: "payment", 
    dueDate: "2023-06-17", 
    status: "pending", 
    priority: "high",
    contactInfo: "(555) 321-6547",
    notes: "Outstanding balance of $450 - needs to discuss payment plan."
  },
  { 
    id: 5, 
    patientName: "Jessica Brown", 
    followUpType: "cancellation", 
    dueDate: "2023-06-15", 
    status: "cancelled", 
    priority: "low",
    contactInfo: "(555) 789-0123",
    notes: "Appointment cancelled due to illness."
  },
  { 
    id: 6, 
    patientName: "Robert Martinez", 
    followUpType: "treatment", 
    dueDate: "2023-06-16", 
    status: "pending", 
    priority: "medium",
    contactInfo: "(555) 234-5678",
    notes: "Follow up on crown placement."
  },
];

interface TaskListProps {
  filter: "all" | "pending" | "completed" | "cancelled";
  searchQuery: string;
}

export function TaskList({ filter, searchQuery }: TaskListProps) {
  const { toast } = useToast();
  const [tasks, setTasks] = useState(initialTasks);

  // Filter tasks based on filter and search query
  const filteredTasks = tasks.filter(task => {
    // First apply status filter
    if (filter !== "all" && task.status !== filter) {
      return false;
    }
    
    // Then apply search filter if there is a search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        task.patientName.toLowerCase().includes(query) || 
        task.followUpType.toLowerCase().includes(query) ||
        task.contactInfo.toLowerCase().includes(query)
      );
    }
    
    return true;
  });

  const updateTaskStatus = (taskId: number, newStatus: string) => {
    const updatedTasks = tasks.map(task => 
      task.id === taskId ? { ...task, status: newStatus } : task
    );
    setTasks(updatedTasks);
    
    const task = tasks.find(t => t.id === taskId);
    toast({
      title: "Task updated",
      description: `${task?.patientName}'s task marked as ${newStatus}`,
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">Pending</Badge>;
      case "completed":
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Completed</Badge>;
      case "cancelled":
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Cancelled</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "cancellation":
        return <XCircle className="h-4 w-4 text-red-500" />;
      case "reschedule":
        return <Calendar className="h-4 w-4 text-indigo-500" />;
      case "treatment":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "payment":
        return <AlertCircle className="h-4 w-4 text-amber-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  if (filteredTasks.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        {searchQuery ? "No tasks matching your search" : "No tasks found"}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {filteredTasks.map((task) => (
        <div 
          key={task.id} 
          className={`p-4 rounded-lg border ${
            task.status === "completed" ? "bg-green-50/30" : 
            task.status === "cancelled" ? "bg-red-50/30" : "bg-white"
          }`}
        >
          <div className="flex justify-between items-start">
            <div className="flex items-start gap-3">
              <div className="mt-1">{getTypeIcon(task.followUpType)}</div>
              <div>
                <h3 className="font-medium flex items-center gap-2">
                  {task.patientName}
                  {task.priority === "high" && (
                    <Badge variant="destructive" className="text-[10px] h-4">Priority</Badge>
                  )}
                </h3>
                <p className="text-xs text-muted-foreground">{task.contactInfo}</p>
                <p className="text-xs mt-1">{task.notes}</p>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              {getStatusBadge(task.status)}
              <div className="flex items-center text-xs text-muted-foreground mt-1">
                <Clock className="h-3 w-3 mr-1" />
                <span>Due: {task.dueDate}</span>
              </div>
            </div>
          </div>
          
          <div className="flex gap-2 mt-4">
            <Button 
              variant="outline" 
              size="sm" 
              className="h-8"
              onClick={() => {
                toast({
                  title: "Calling patient",
                  description: `Initiating call to ${task.patientName}`,
                });
              }}
            >
              <Phone className="h-3 w-3 mr-2" />
              Call
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="h-8"
              onClick={() => {
                toast({
                  title: "Email sent",
                  description: `Email sent to ${task.patientName}`,
                });
              }}
            >
              <Mail className="h-3 w-3 mr-2" />
              Email
            </Button>
            
            {task.status === "pending" && (
              <Button 
                variant="outline" 
                size="sm" 
                className="h-8 ml-auto"
                onClick={() => updateTaskStatus(task.id, "completed")}
              >
                <CheckCircle className="h-3 w-3 mr-2" />
                Mark Complete
              </Button>
            )}
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 px-2">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {task.status !== "completed" && (
                  <DropdownMenuItem onClick={() => updateTaskStatus(task.id, "completed")}>
                    Mark as Completed
                  </DropdownMenuItem>
                )}
                {task.status !== "cancelled" && (
                  <DropdownMenuItem onClick={() => updateTaskStatus(task.id, "cancelled")}>
                    Mark as Cancelled
                  </DropdownMenuItem>
                )}
                {task.status !== "pending" && (
                  <DropdownMenuItem onClick={() => updateTaskStatus(task.id, "pending")}>
                    Mark as Pending
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      ))}
    </div>
  );
}
