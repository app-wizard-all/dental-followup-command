
import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { 
  Search, 
  Phone, 
  UserPlus, 
  ClipboardCheck, 
  BadgeCheck, 
  CreditCard, 
  Calendar, 
  Clock,
  FileText,
  Eye,
  Printer
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface GuideItem {
  id: string;
  title: string;
  content: string;
  steps?: string[];
  pdfUrl?: string;
}

interface GuideCategory {
  id: string;
  title: string;
  icon: React.FC<{ className?: string }>;
  items: GuideItem[];
}

const guideData: GuideCategory[] = [
  {
    id: "phone-calls",
    title: "Phone Calls",
    icon: Phone,
    items: [
      {
        id: "incoming-calls",
        title: "Handling Incoming Calls",
        content: "Follow these steps when answering phone calls at the front desk:",
        steps: [
          "Answer before the third ring with a smile in your voice",
          "Greet with: 'Thank you for calling DentalCare, this is [Your Name], how may I help you today?'",
          "Listen actively to the caller's needs",
          "Take detailed notes in the patient's file",
          "Verify caller's identity by asking for date of birth and address",
          "Handle the request or transfer to appropriate staff"
        ],
        pdfUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
      },
      {
        id: "appointment-calls",
        title: "Scheduling Appointments",
        content: "When scheduling appointments over the phone:",
        steps: [
          "Check provider availability in the calendar",
          "Offer 2-3 available time slots",
          "Confirm patient information (name, DOB, contact number)",
          "Explain appointment duration and any preparation needed",
          "Summarize the appointment details before ending the call",
          "Send confirmation via text or email"
        ]
      },
      {
        id: "emergency-calls",
        title: "Handling Emergency Calls",
        content: "For dental emergency calls:",
        steps: [
          "Remain calm and reassuring",
          "Assess the severity by asking about pain level, bleeding, swelling",
          "For severe emergencies (uncontrolled bleeding, trauma, severe infection), direct to ER",
          "For dental emergencies, schedule same-day appointment",
          "Provide immediate care instructions",
          "Document all emergency call details"
        ]
      }
    ]
  },
  {
    id: "new-patients",
    title: "New Patients",
    icon: UserPlus,
    items: [
      {
        id: "registration",
        title: "New Patient Registration",
        content: "Guide for registering new patients:",
        steps: [
          "Welcome the patient warmly to the practice",
          "Provide registration forms or direct to iPad for digital forms",
          "Explain each form's purpose (medical history, insurance, HIPAA)",
          "Collect photo ID and insurance card",
          "Verify insurance eligibility",
          "Enter information into the system",
          "Offer a tour of the office"
        ]
      },
      {
        id: "welcome-package",
        title: "Preparing Welcome Package",
        content: "For new patient welcome packages:",
        steps: [
          "Include practice brochure",
          "Add doctor/team bio cards",
          "Include service menu with pricing",
          "Add oral health educational materials",
          "Include special offers for new patients",
          "Add business card and contact information",
          "Present in a branded folder"
        ]
      }
    ]
  },
  {
    id: "follow-ups",
    title: "Follow-Ups",
    icon: ClipboardCheck,
    items: [
      {
        id: "treatment-follow-up",
        title: "Post-Treatment Follow-Ups",
        content: "For following up after treatments:",
        steps: [
          "Call patient 24-48 hours after procedure",
          "Ask specifically about pain, swelling, or other concerns",
          "Document all responses in patient records",
          "Address any issues immediately, consulting with provider if needed",
          "Remind about follow-up appointment if scheduled",
          "Provide additional care instructions if needed"
        ]
      },
      {
        id: "missed-appointments",
        title: "Missed Appointment Follow-Ups",
        content: "When patients miss appointments:",
        steps: [
          "Call within 24 hours of missed appointment",
          "Express concern rather than criticism",
          "Offer to reschedule at a convenient time",
          "Gently remind about cancellation policy",
          "Document the missed appointment and follow-up in their record",
          "Flag for provider review if pattern develops"
        ]
      }
    ]
  },
  {
    id: "checkout",
    title: "Checkout Process",
    icon: CreditCard,
    items: [
      {
        id: "payment-processing",
        title: "Processing Payments",
        content: "Steps for handling patient payments:",
        steps: [
          "Review completed treatment with patient",
          "Present treatment cost breakdown",
          "Process payment (card, cash, check, care credit)",
          "Provide detailed receipt",
          "Explain insurance claim process if applicable",
          "Schedule follow-up appointments",
          "Thank patient and provide care instructions"
        ]
      },
      {
        id: "insurance-claims",
        title: "Filing Insurance Claims",
        content: "Process for filing insurance claims:",
        steps: [
          "Verify insurance information is current",
          "Collect necessary documentation (x-rays, narratives)",
          "Enter proper procedure codes and diagnoses",
          "Submit claim electronically same day when possible",
          "Document claim submission in patient record",
          "Set follow-up reminder to check claim status after 2 weeks",
          "Communicate with patient about claim progress"
        ]
      }
    ]
  },
  {
    id: "consents",
    title: "Consent Forms",
    icon: BadgeCheck,
    items: [
      {
        id: "treatment-consent",
        title: "Treatment Consent Forms",
        content: "Guide for obtaining treatment consents:",
        steps: [
          "Prepare appropriate consent form for specific procedure",
          "Explain procedure in patient-friendly language",
          "Review risks, benefits, and alternatives",
          "Answer all patient questions thoroughly",
          "Have patient initial each section and sign the form",
          "Witness the signature",
          "Scan signed consent into patient record",
          "Provide copy to patient if requested"
        ]
      },
      {
        id: "hipaa-consent",
        title: "HIPAA Consent Management",
        content: "For handling HIPAA consents:",
        steps: [
          "Review HIPAA Notice of Privacy Practices with patient",
          "Explain how their information may be used and disclosed",
          "Have patient complete and sign acknowledgment form",
          "Document if patient refuses to sign",
          "Update HIPAA consents annually",
          "Maintain signed forms in patient record",
          "Provide copy to patient upon request"
        ]
      }
    ]
  },
  {
    id: "scheduling",
    title: "Scheduling",
    icon: Calendar,
    items: [
      {
        id: "appointment-booking",
        title: "Booking Appointments",
        content: "Process for scheduling appointments:",
        steps: [
          "Identify appointment type and required time",
          "Check provider schedule for availability",
          "Consider patient preference for day/time",
          "Block appropriate time in schedule",
          "Enter detailed appointment notes",
          "Confirm patient contact information",
          "Set up appointment reminders",
          "Document scheduling in patient record"
        ]
      },
      {
        id: "recall-system",
        title: "Managing Recall System",
        content: "Steps for managing patient recalls:",
        steps: [
          "Identify patients due for recall appointments",
          "Send reminders via preferred contact method (text/email/call)",
          "Follow up on non-responsive patients after 2 weeks",
          "Document all recall attempts",
          "Schedule appointments for responding patients",
          "Update recall status in patient record",
          "Generate monthly recall effectiveness reports"
        ]
      }
    ]
  },
  {
    id: "operations",
    title: "Daily Operations",
    icon: Clock,
    items: [
      {
        id: "opening-procedures",
        title: "Opening Procedures",
        content: "Morning opening checklist:",
        steps: [
          "Arrive 30 minutes before first appointment",
          "Turn on all equipment and computers",
          "Check temperature and adjust HVAC as needed",
          "Review day's schedule for special needs or preparations",
          "Check for any emergency messages",
          "Prepare patient charts/rooms for first appointments",
          "Conduct morning team huddle",
          "Set up front desk area"
        ]
      },
      {
        id: "closing-procedures",
        title: "Closing Procedures",
        content: "End of day closing procedures:",
        steps: [
          "Process end-of-day reports",
          "Balance daily transactions",
          "Submit insurance claims",
          "Confirm next day's schedule",
          "Send appointment reminders for next day",
          "Secure cash and checks",
          "Back up practice management system",
          "Turn off equipment and set security system"
        ]
      }
    ]
  }
];

export function HelpGuideTabs() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("phone-calls");
  const [activePdfUrl, setActivePdfUrl] = useState<string | null>(null);
  
  const filteredGuides = searchQuery 
    ? guideData.flatMap(category => 
        category.items.filter(item => 
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (item.steps && item.steps.some(step => 
            step.toLowerCase().includes(searchQuery.toLowerCase())
          ))
        ).map(item => ({...item, categoryId: category.id}))
      )
    : [];

  const handlePrintPdf = () => {
    if (!activePdfUrl) return;
    
    // Open PDF in new window for printing
    const printWindow = window.open(activePdfUrl, '_blank');
    if (printWindow) {
      printWindow.onload = () => {
        printWindow.print();
      };
    }
  };

  return (
    <div>
      <div className="relative mb-6">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search for guides, procedures, or keywords..."
          className="pl-8"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {searchQuery && (
        <div className="mb-6">
          <h3 className="mb-4 text-lg font-medium">Search Results ({filteredGuides.length})</h3>
          {filteredGuides.length > 0 ? (
            <div className="space-y-4">
              {filteredGuides.map(guide => (
                <Card key={guide.id} className="overflow-hidden">
                  <CardHeader className="bg-dental-mint/10 p-4">
                    <CardTitle className="text-md">{guide.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4">
                    <p className="mb-2 text-sm text-muted-foreground">{guide.content}</p>
                    {guide.steps && (
                      <ol className="list-decimal pl-5 space-y-1 text-sm">
                        {guide.steps.map((step, index) => (
                          <li key={index}>{step}</li>
                        ))}
                      </ol>
                    )}
                    {guide.pdfUrl && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="mt-4"
                        onClick={() => setActivePdfUrl(guide.pdfUrl)}
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        View PDF Resource
                      </Button>
                    )}
                    <div className="mt-4">
                      <Button 
                        variant="link" 
                        size="sm" 
                        className="p-0 text-dental-teal"
                        onClick={() => {
                          setSearchQuery("");
                          setActiveCategory(guide.categoryId as string);
                        }}
                      >
                        View full category
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center p-6 bg-gray-50 rounded-md">
              <p className="text-muted-foreground">No guides found for "{searchQuery}"</p>
              <Button 
                variant="link" 
                onClick={() => setSearchQuery("")}
                className="text-dental-teal mt-2"
              >
                Clear search
              </Button>
            </div>
          )}
        </div>
      )}

      {!searchQuery && (
        <Tabs value={activeCategory} onValueChange={setActiveCategory} className="w-full">
          <TabsList className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2 mb-6">
            {guideData.map(category => (
              <TabsTrigger 
                key={category.id} 
                value={category.id}
                className="flex items-center"
              >
                <category.icon className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">{category.title}</span>
              </TabsTrigger>
            ))}
          </TabsList>
          
          {guideData.map(category => (
            <TabsContent key={category.id} value={category.id} className="mt-4">
              <Card>
                <CardHeader className="bg-dental-mint/10">
                  <div className="flex items-center">
                    <category.icon className="h-5 w-5 mr-2 text-dental-teal" />
                    <CardTitle>{category.title} Guide</CardTitle>
                  </div>
                  <CardDescription>
                    Step-by-step instructions for {category.title.toLowerCase()} procedures
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <Accordion type="single" collapsible className="w-full">
                    {category.items.map(item => (
                      <AccordionItem key={item.id} value={item.id}>
                        <AccordionTrigger className="text-dental-gray hover:text-dental-teal">
                          <div className="flex items-center">
                            {item.title}
                            {item.pdfUrl && (
                              <Dialog>
                                <DialogTrigger asChild onClick={(e) => e.stopPropagation()}>
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="ml-2 h-6 w-6 p-0"
                                  >
                                    <Eye className="h-4 w-4 text-dental-teal" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-4xl h-[80vh]">
                                  <DialogHeader>
                                    <DialogTitle>{item.title} PDF Resource</DialogTitle>
                                  </DialogHeader>
                                  <div className="h-full mt-4">
                                    <iframe
                                      src={item.pdfUrl}
                                      className="w-full h-full rounded-md"
                                      title={`${item.title} PDF`}
                                    />
                                  </div>
                                </DialogContent>
                              </Dialog>
                            )}
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <p className="mb-4 text-muted-foreground">{item.content}</p>
                          {item.steps && (
                            <ol className="list-decimal pl-5 space-y-2">
                              {item.steps.map((step, index) => (
                                <li key={index}>{step}</li>
                              ))}
                            </ol>
                          )}
                          {item.pdfUrl && (
                            <div className="mt-4 flex space-x-2">
                              <Button 
                                variant="outline" 
                                onClick={() => setActivePdfUrl(item.pdfUrl)}
                              >
                                <FileText className="h-4 w-4 mr-2" />
                                View Full PDF Resource
                              </Button>
                              <Button
                                variant="outline"
                                onClick={() => {
                                  if (item.pdfUrl) {
                                    const printWindow = window.open(item.pdfUrl, '_blank');
                                    if (printWindow) {
                                      printWindow.onload = () => {
                                        printWindow.print();
                                      };
                                    }
                                  }
                                }}
                              >
                                <Printer className="h-4 w-4 mr-2" />
                                Print PDF
                              </Button>
                            </div>
                          )}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      )}

      {activePdfUrl && (
        <Dialog open={!!activePdfUrl} onOpenChange={(open) => !open && setActivePdfUrl(null)}>
          <DialogContent className="max-w-5xl h-[85vh]">
            <DialogHeader>
              <DialogTitle className="flex items-center justify-between">
                <span>PDF Resource</span>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handlePrintPdf}
                >
                  <Printer className="h-4 w-4 mr-2" />
                  Print PDF
                </Button>
              </DialogTitle>
            </DialogHeader>
            <div className="h-full mt-4">
              <iframe
                src={activePdfUrl}
                className="w-full h-full rounded-md"
                title="PDF Resource"
              />
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
