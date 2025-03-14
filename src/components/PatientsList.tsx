
import React from "react";
import { Button } from "@/components/ui/button";
import { Clock, Phone, Mail, CheckCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useTomorrowCancellations, useContactPatient, OpenDentalCancellation } from "@/services/openDentalApi";
import { Skeleton } from "@/components/ui/skeleton";

export function PatientsList() {
  const { toast } = useToast();
  const { data: cancellations, isLoading, error } = useTomorrowCancellations();
  const contactPatientMutation = useContactPatient();

  const handleCall = (patient: OpenDentalCancellation) => {
    contactPatientMutation.mutate(
      { patientId: patient.patientId, method: 'phone' },
      {
        onSuccess: () => {
          toast({
            title: "Calling patient",
            description: `Initiating call to ${patient.patientName}`,
          });
        },
        onError: (error) => {
          toast({
            title: "Call failed",
            description: "Unable to initiate call. Please try again.",
            variant: "destructive",
          });
          console.error("Call error:", error);
        }
      }
    );
  };

  const handleEmail = (patient: OpenDentalCancellation) => {
    contactPatientMutation.mutate(
      { patientId: patient.patientId, method: 'email' },
      {
        onSuccess: () => {
          toast({
            title: "Email sent",
            description: `Follow-up email sent to ${patient.patientName}`,
          });
        },
        onError: (error) => {
          toast({
            title: "Email failed",
            description: "Unable to send email. Please try again.",
            variant: "destructive",
          });
          console.error("Email error:", error);
        }
      }
    );
  };

  const handleMarkAsContacted = (patient: OpenDentalCancellation) => {
    toast({
      title: "Status updated",
      description: `${patient.patientName} marked as contacted`,
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="p-3 rounded-md border bg-white">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-4 w-24" />
              </div>
              <Skeleton className="h-4 w-20" />
            </div>
            <div className="flex gap-1 mt-4">
              <Skeleton className="h-7 w-16" />
              <Skeleton className="h-7 w-16" />
              <Skeleton className="h-7 w-24 ml-auto" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 rounded-md bg-red-50 text-red-600 border border-red-200">
        <p>Unable to load cancellations. Please try again later.</p>
        <p className="text-xs mt-1">Error: {error instanceof Error ? error.message : "Unknown error"}</p>
      </div>
    );
  }

  if (!cancellations || cancellations.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No cancellations for tomorrow
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {cancellations.map((patient) => (
        <div 
          key={patient.appointmentId} 
          className="p-3 rounded-md border bg-white flex flex-col gap-2"
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium flex items-center gap-1">
                {patient.patientName}
                {patient.cancellationReason === "Personal emergency" && (
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
              <p className="text-xs text-muted-foreground">{patient.procedureDescription}</p>
              {patient.notes && (
                <p className="text-xs mt-1 italic">{patient.notes}</p>
              )}
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
              disabled={contactPatientMutation.isPending}
            >
              <Phone className="h-3 w-3 mr-1" />
              Call
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-7 px-2 text-xs"
              onClick={() => handleEmail(patient)}
              disabled={contactPatientMutation.isPending}
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
