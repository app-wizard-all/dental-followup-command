
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";
import { FollowUpTask } from "@/services/openDentalApi";
import { TaskStatusBadge } from "./TaskStatusBadge";
import { TaskTypeIcon } from "./TaskTypeIcon";
import { TaskActions } from "./TaskActions";

interface TaskItemProps {
  task: FollowUpTask;
}

export function TaskItem({ task }: TaskItemProps) {
  return (
    <div 
      className={`p-4 rounded-lg border ${
        task.status === "completed" ? "bg-green-50/30" : 
        task.status === "cancelled" ? "bg-red-50/30" : "bg-white"
      }`}
    >
      <div className="flex justify-between items-start">
        <div className="flex items-start gap-3">
          <div className="mt-1">
            <TaskTypeIcon type={task.followUpType} />
          </div>
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
          <TaskStatusBadge status={task.status} />
          <div className="flex items-center text-xs text-muted-foreground mt-1">
            <Clock className="h-3 w-3 mr-1" />
            <span>Due: {task.dueDate}</span>
          </div>
        </div>
      </div>
      
      <TaskActions task={task} />
    </div>
  );
}
