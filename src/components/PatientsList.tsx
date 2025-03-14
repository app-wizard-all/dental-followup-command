
import React from "react";
import { Button } from "@/components/ui/button";
import { Clock, Phone, Mail, CheckCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

// Sample data for patients who cancelled next day appointments
const cancelledPatients = [
  { 
    id: 1, 
    name: "Sarah Johnson", 
    phone: "(555) 123-4567", 
    email: "sarah.j@example.com", 
    procedure: "Tooth Extraction",
    status: "Not Contacted",
    priority: "high"
  },
  { 
    id: 2, 
    name: "Michael Chen", 
    phone: "(555) 987-6543", 
    email: "m.chen@example.com", 
    procedure: "Cleaning",
    status: "Not Contacted",
    priority: "medium"
  },
  { 
    id: 3, 
    name: "Emily Williams", 
    phone: "(555) 456-7890", 
    email: "e.williams@example.com", 
    procedure: "Filling",
    status: "Not Contacted",
    priority: "medium"
  },
  { 
    id: 4, 
    name: "David Taylor", 
    phone: "(555) 321-6547", 
    email: "d.taylor@example.com", 
    procedure: "Crown",
    status: "Not Contacted",
    priority: "high"
  },
  { 
    id: 5, 
    name: "Jessica Brown", 
    phone: "(555) 789-0123", 
    email: "j.brown@example.com", 
    procedure: "Consultation",
    status: "Not Contacted",
    priority: "low"
  }
];

export function PatientsList() {
  const { toast } = useToast();

  const handleCall = (patient: typeof cancelledPatients[0]) => {
    toast({
      title: "Calling patient",
      description: `Initiating call to ${patient.name}`,
    });
  };

  const handleEmail = (patient: typeof cancelledPatients[0]) => {
    toast({
      title: "Email sent",
      description: `Follow-up email sent to ${patient.name}`,
    });
  };

  const handleMarkAsContacted = (patient: typeof cancelledPatients[0]) => {
    toast({
      title: "Status updated",
      description: `${patient.name} marked as contacted`,
    });
  };

  return (
    <div className="space-y-4">
      {cancelledPatients.map((patient) => (
        <div 
          key={patient.id} 
          className="p-3 rounded-md border bg-white flex flex-col gap-2"
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium flex items-center gap-1">
                {patient.name}
                {patient.priority === "high" && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Badge variant="destructive" className="ml-2 text-[10px] h-4">Priority</Badge>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-xs">High priority patient</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </h3>
              <p className="text-xs text-muted-foreground">{patient.procedure}</p>
            </div>
            <div className="flex items-center">
              <Clock className="h-3 w-3 text-muted-foreground mr-1" />
              <span className="text-xs text-muted-foreground">Tomorrow</span>
            </div>
          </div>
          <div className="flex gap-1 mt-1">
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-7 px-2 text-xs"
              onClick={() => handleCall(patient)}
            >
              <Phone className="h-3 w-3 mr-1" />
              Call
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-7 px-2 text-xs"
              onClick={() => handleEmail(patient)}
            >
              <Mail className="h-3 w-3 mr-1" />
              Email
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-7 px-2 text-xs ml-auto"
              onClick={() => handleMarkAsContacted(patient)}
            >
              <CheckCircle className="h-3 w-3 mr-1" />
              Mark Contacted
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
