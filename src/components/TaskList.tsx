
import React from "react";
import { useFollowUpTasks } from "@/services/openDentalApi";
import { TaskItem } from "./task/TaskItem";
import { TaskEmptyState } from "./task/TaskEmptyState";
import { TaskLoadingSkeleton } from "./task/TaskLoadingSkeleton";

interface TaskListProps {
  filter: "all" | "pending" | "completed" | "cancelled";
  searchQuery: string;
  category?: string;
}

export function TaskList({ filter, searchQuery, category }: TaskListProps) {
  const { data: tasks, isLoading, error } = useFollowUpTasks();

  // Filter tasks based on filter, search query, and category
  const filteredTasks = !tasks ? [] : tasks.filter(task => {
    // First apply category filter if specified
    if (category && task.followUpType !== category) {
      return false;
    }
    
    // Then apply status filter
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

  if (isLoading) {
    return <TaskLoadingSkeleton />;
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-500">
        Error loading tasks: {error instanceof Error ? error.message : "Unknown error"}
      </div>
    );
  }

  if (filteredTasks.length === 0) {
    return <TaskEmptyState searchQuery={searchQuery} />;
  }

  return (
    <div className="space-y-3">
      {filteredTasks.map((task) => (
        <TaskItem key={task.id} task={task} />
      ))}
    </div>
  );
}
