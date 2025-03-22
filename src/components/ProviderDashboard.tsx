
import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { PatientNotesTab } from "@/components/tabs/PatientNotesTab";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays, Users } from "lucide-react";

export type ProviderSection = "patientNotes" | "appointments" | "summary";

interface ProviderDashboardProps {
  initialSection?: ProviderSection | null;
}

export function ProviderDashboard({ initialSection = null }: ProviderDashboardProps) {
  const [activeSection, setActiveSection] = useState<ProviderSection | null>(initialSection);
  const location = useLocation();
  
  // Update active section when URL changes
  React.useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const sectionParam = searchParams.get('section');
    
    if (sectionParam && ['patientNotes', 'appointments'].includes(sectionParam)) {
      setActiveSection(sectionParam as ProviderSection);
    } else {
      setActiveSection(null); // No section parameter means we're on the summary dashboard
    }
  }, [location]);

  // Function to render the active section content
  const renderSectionContent = () => {
    if (activeSection === "patientNotes") {
      return <PatientNotesTab />;
    } else {
      // Default to summary view with quicklinks
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => {
                  const searchParams = new URLSearchParams(location.search);
                  searchParams.set('section', 'patientNotes');
                  window.location.search = searchParams.toString();
                }}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xl">Patient Notes</CardTitle>
              <Users className="h-5 w-5 text-dental-blue" />
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Record and transcribe patient notes using voice recognition.
              </p>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xl">Appointments</CardTitle>
              <CalendarDays className="h-5 w-5 text-dental-blue" />
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                View and manage your upcoming appointments.
              </p>
            </CardContent>
          </Card>
        </div>
      );
    }
  };

  return (
    <div className="space-y-4">
      {renderSectionContent()}
    </div>
  );
}
