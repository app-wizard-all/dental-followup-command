
import React from "react";

interface TaskEmptyStateProps {
  searchQuery?: string;
}

export function TaskEmptyState({ searchQuery }: TaskEmptyStateProps) {
  return (
    <div className="text-center py-8 text-muted-foreground">
      {searchQuery ? "No tasks matching your search" : "No tasks found"}
    </div>
  );
}
