
import React from "react";
import { TaskList } from "@/components/TaskList";
import { TaskForm } from "@/components/TaskForm";

export function FollowUpsTab() {
  return (
    <div className="grid gap-6">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-2/3">
          <TaskList />
        </div>
        <div className="w-full md:w-1/3">
          <TaskForm />
        </div>
      </div>
    </div>
  );
}
