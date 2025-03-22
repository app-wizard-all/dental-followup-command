
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { PatientNotesTab } from "@/components/tabs/PatientNotesTab";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Home } from "lucide-react";

export type ProviderSection = "patientNotes" | "appointments" | "summary";

interface ProviderDashboardProps {
  initialSection?: ProviderSection | null;
}

export function ProviderDashboard({ initialSection = null }: ProviderDashboardProps) {
  const [activeSection, setActiveSection] = useState<ProviderSection | null>(initialSection);
  const location = useLocation();
  const navigate = useNavigate();
  
  // Update active section when URL changes
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const sectionParam = searchParams.get('section');
    
    if (sectionParam && ['patientNotes'].includes(sectionParam)) {
      setActiveSection(sectionParam as ProviderSection);
    } else {
      setActiveSection(null); // No section parameter means we're on the summary dashboard
    }
  }, [location]);

  // Function to navigate to a section
  const navigateToSection = (section: ProviderSection) => {
    const searchParams = new URLSearchParams(location.search);
    searchParams.set('section', section);
    // Preserve the role parameter
    navigate(`/?${searchParams.toString()}`);
  };

  // Function to render the active section content
  const renderSectionContent = () => {
    if (activeSection === "patientNotes") {
      return <PatientNotesTab />;
    } else {
      // Default to summary view with quicklinks
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card 
            className="hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => navigateToSection('patientNotes')}
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xl">Patient Notes</CardTitle>
              <FileText className="h-5 w-5 text-dental-blue" />
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Record and transcribe patient notes using voice recognition.
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-dental-mint/10 border-dental-teal/30">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xl">Provider Dashboard</CardTitle>
              <Home className="h-5 w-5 text-dental-teal" />
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Welcome to the Provider Dashboard. Select a section from the sidebar or click on Patient Notes to start recording patient information.
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
