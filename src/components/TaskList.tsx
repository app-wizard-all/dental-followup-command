
import React from "react";
import { Button } from "@/components/ui/button";
import { 
  Phone, 
  Mail, 
  CheckCircle, 
  AlertCircle, 
  Clock,
  XCircle,
  Calendar,
  MoreHorizontal,
  Loader2
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { 
  useFollowUpTasks, 
  useUpdateFollowUpTask, 
  useContactPatient,
  FollowUpTask
} from "@/services/openDentalApi";
import { Skeleton } from "@/components/ui/skeleton";

interface TaskListProps {
  filter: "all" | "pending" | "completed" | "cancelled";
  searchQuery: string;
}

export function TaskList({ filter, searchQuery }: TaskListProps) {
  const { toast } = useToast();
  const { data: tasks, isLoading, error } = useFollowUpTasks();
  const updateTaskMutation = useUpdateFollowUpTask();
  const contactPatientMutation = useContactPatient();

  // Filter tasks based on filter and search query
  const filteredTasks = !tasks ? [] : tasks.filter(task => {
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
        task.contactInfo.toLowerCase().includes(query) ||
        (task.notes && task.notes.toLowerCase().includes(query))
      );
    }
    
    return true;
  });

  const updateTaskStatus = (taskId: string, newStatus: string) => {
    updateTaskMutation.mutate(
      { 
        taskId, 
        updates: { status: newStatus } 
      },
      {
        onSuccess: (updatedTask) => {
          toast({
            title: "Task updated",
            description: `${updatedTask.patientName}'s task marked as ${newStatus}`,
          });
        },
        onError: (error) => {
          toast({
            title: "Update failed",
            description: "Failed to update task status. Please try again.",
            variant: "destructive",
          });
          console.error("Failed to update task:", error);
        }
      }
    );
  };

  const handleContactPatient = (task: FollowUpTask, method: 'phone' | 'email') => {
    contactPatientMutation.mutate(
      { patientId: task.patientId, method },
      {
        onSuccess: () => {
          toast({
            title: method === 'phone' ? "Calling patient" : "Email sent",
            description: method === 'phone' 
              ? `Initiating call to ${task.patientName}` 
              : `Email sent to ${task.patientName}`,
          });
        },
        onError: (error) => {
          toast({
            title: "Contact failed",
            description: `Failed to ${method === 'phone' ? 'call' : 'email'} patient. Please try again.`,
            variant: "destructive",
          });
          console.error("Contact error:", error);
        }
      }
    );
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

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="p-4 rounded-lg border bg-white">
            <div className="flex justify-between items-start">
              <div className="flex items-start gap-3">
                <Skeleton className="h-5 w-5 rounded-full" />
                <div>
                  <Skeleton className="h-5 w-40 mb-2" />
                  <Skeleton className="h-4 w-24 mb-2" />
                  <Skeleton className="h-3 w-56" />
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <Skeleton className="h-5 w-20" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-8 w-32 ml-auto" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-500">
        Error loading tasks: {error instanceof Error ? error.message : "Unknown error"}
      </div>
    );
  }

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
              onClick={() => handleContactPatient(task, 'phone')}
              disabled={contactPatientMutation.isPending || updateTaskMutation.isPending}
            >
              {contactPatientMutation.isPending ? (
                <Loader2 className="h-3 w-3 mr-2 animate-spin" />
              ) : (
                <Phone className="h-3 w-3 mr-2" />
              )}
              Call
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="h-8"
              onClick={() => handleContactPatient(task, 'email')}
              disabled={contactPatientMutation.isPending || updateTaskMutation.isPending}
            >
              {contactPatientMutation.isPending ? (
                <Loader2 className="h-3 w-3 mr-2 animate-spin" />
              ) : (
                <Mail className="h-3 w-3 mr-2" />
              )}
              Email
            </Button>
            
            {task.status === "pending" && (
              <Button 
                variant="outline" 
                size="sm" 
                className="h-8 ml-auto"
                onClick={() => updateTaskStatus(task.id, "completed")}
                disabled={updateTaskMutation.isPending}
              >
                {updateTaskMutation.isPending ? (
                  <Loader2 className="h-3 w-3 mr-2 animate-spin" />
                ) : (
                  <CheckCircle className="h-3 w-3 mr-2" />
                )}
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
                  <DropdownMenuItem 
                    onClick={() => updateTaskStatus(task.id, "completed")}
                    disabled={updateTaskMutation.isPending}
                  >
                    Mark as Completed
                  </DropdownMenuItem>
                )}
                {task.status !== "cancelled" && (
                  <DropdownMenuItem 
                    onClick={() => updateTaskStatus(task.id, "cancelled")}
                    disabled={updateTaskMutation.isPending}
                  >
                    Mark as Cancelled
                  </DropdownMenuItem>
                )}
                {task.status !== "pending" && (
                  <DropdownMenuItem 
                    onClick={() => updateTaskStatus(task.id, "pending")}
                    disabled={updateTaskMutation.isPending}
                  >
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
