
import React from "react";
import { Button } from "@/components/ui/button";
import { Phone, Mail, CheckCircle, MoreHorizontal, Loader2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { FollowUpTask, useUpdateFollowUpTask, useContactPatient } from "@/services/openDentalApi";

interface TaskActionsProps {
  task: FollowUpTask;
}

export function TaskActions({ task }: TaskActionsProps) {
  const { toast } = useToast();
  const updateTaskMutation = useUpdateFollowUpTask();
  const contactPatientMutation = useContactPatient();

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

  const handleContactPatient = (method: 'phone' | 'email') => {
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

  return (
    <div className="flex gap-2 mt-4">
      <Button 
        variant="outline" 
        size="sm" 
        className="h-8"
        onClick={() => handleContactPatient('phone')}
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
        onClick={() => handleContactPatient('email')}
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
  );
}
