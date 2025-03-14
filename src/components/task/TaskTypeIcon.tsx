
import React from "react";
import { XCircle, Calendar, CheckCircle, AlertCircle, Clock } from "lucide-react";

interface TaskTypeIconProps {
  type: string;
}

export function TaskTypeIcon({ type }: TaskTypeIconProps) {
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
}
