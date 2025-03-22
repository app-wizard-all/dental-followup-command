
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { usePatients } from "@/hooks/usePatients";
import { Textarea } from "@/components/ui/textarea";
import { Mic, MicOff, Save, Search, Upload, AlertCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { addDays } from "date-fns";
import { DateRange } from "react-day-picker";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function PatientNotesTab() {
  // State for date range
  const [dateRange, setDateRange] = useState({
    from: new Date(),
    to: addDays(new Date(), 0),
  });
  
  // Handle date range changes with proper type conversion
  const handleDateRangeChange = (newRange: DateRange) => {
    // Ensure that both from and to dates are present
    setDateRange({
      from: newRange.from || new Date(),
      to: newRange.to || newRange.from || new Date(),
    });
  };
  
  // Search query state
  const [searchQuery, setSearchQuery] = useState("");
  
  // Selected patient state
  const [selectedPatient, setSelectedPatient] = useState<null | {
    id: string;
    name: string;
  }>(null);
  
  // Voice recording states
  const [isRecording, setIsRecording] = useState(false);
  const [recordedText, setRecordedText] = useState("");
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const [permissionError, setPermissionError] = useState<string | null>(null);
  
  // Mock fetch patients - in a real app, replace with an actual API call
  const { patients, isLoading } = usePatients(dateRange.from, dateRange.to);
  
  // Filter patients based on search query
  const filteredPatients = patients?.filter(patient => 
    patient.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Reset permission error when component unmounts
  useEffect(() => {
    return () => {
      if (mediaRecorder && mediaRecorder.state === 'recording') {
        mediaRecorder.stop();
      }
    };
  }, [mediaRecorder]);

  // Start recording function
  const startRecording = async () => {
    try {
      // Reset any previous errors
      setPermissionError(null);
      
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        } 
      });
      const recorder = new MediaRecorder(stream);
      setMediaRecorder(recorder);
      
      // Clear previous chunks
      setAudioChunks([]);
      
      recorder.ondataavailable = (e) => {
        setAudioChunks(prev => [...prev, e.data]);
      };
      
      recorder.onstop = async () => {
        try {
          // Convert audio chunks to blob
          const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
          
          // Convert blob to base64
          const reader = new FileReader();
          reader.readAsDataURL(audioBlob);
          reader.onloadend = async () => {
            const base64Audio = reader.result?.toString().split(',')[1];
            
            if (base64Audio) {
              toast({
                title: "Transcribing audio...",
                description: "Please wait while we process your recording.",
              });
              
              // In a real implementation, we would send this to our backend API
              // For now, let's simulate a response after a delay
              setTimeout(() => {
                // This is where you would normally get the response from your API
                const mockTranscription = "This is a simulated transcription. The patient is responding well to treatment and showed improvement in their condition.";
                setRecordedText(prev => prev + " " + mockTranscription);
                
                toast({
                  title: "Transcription complete",
                  description: "Your recording has been processed successfully.",
                });
              }, 2000);
            }
          };
        } catch (error) {
          console.error("Error processing audio:", error);
          toast({
            title: "Transcription failed",
            description: "There was an error processing your recording.",
            variant: "destructive",
          });
        }
      };
      
      // Start recording
      recorder.start();
      setIsRecording(true);
      
      toast({
        title: "Recording started",
        description: "Speak clearly into your microphone.",
      });
    } catch (error) {
      console.error("Error accessing microphone:", error);
      
      // Check if it's a permission error
      if (error instanceof DOMException && 
          (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError')) {
        setPermissionError("Microphone access was denied. Please allow access in your browser settings and try again.");
      } else {
        setPermissionError(`Unable to access microphone: ${error instanceof Error ? error.message : String(error)}`);
      }
      
      toast({
        title: "Unable to access microphone",
        description: "Please make sure you've given permission to use the microphone.",
        variant: "destructive",
      });
    }
  };

  // Stop recording function
  const stopRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
      setIsRecording(false);
      
      // Stop all audio tracks
      mediaRecorder.stream.getTracks().forEach(track => track.stop());
      
      toast({
        title: "Recording stopped",
        description: "Processing your recording...",
      });
    }
  };

  // Save note function
  const saveNote = () => {
    if (!selectedPatient) {
      toast({
        title: "No patient selected",
        description: "Please select a patient first.",
        variant: "destructive",
      });
      return;
    }
    
    if (!recordedText.trim()) {
      toast({
        title: "Empty note",
        description: "Please record or type a note before saving.",
        variant: "destructive",
      });
      return;
    }
    
    // In a real app, this would call an API to save the note
    toast({
      title: "Note saved",
      description: `Note saved for patient ${selectedPatient.name}.`,
    });
  };

  // Publish note to OpenDental
  const publishNote = () => {
    if (!selectedPatient) {
      toast({
        title: "No patient selected",
        description: "Please select a patient first.",
        variant: "destructive",
      });
      return;
    }
    
    if (!recordedText.trim()) {
      toast({
        title: "Empty note",
        description: "Please record or type a note before publishing.",
        variant: "destructive",
      });
      return;
    }
    
    // In a real app, this would call an API to publish the note to OpenDental
    toast({
      title: "Note published",
      description: `Note published to OpenDental for patient ${selectedPatient.name}.`,
    });
    
    // Reset for next note
    setSelectedPatient(null);
    setRecordedText("");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-end">
        <div className="w-full md:w-auto">
          <Label htmlFor="date-range" className="mb-2 block">Date Range</Label>
          <DateRangePicker 
            value={dateRange}
            onValueChange={handleDateRangeChange}
          />
        </div>
        <div className="flex-1 w-full">
          <Label htmlFor="search" className="mb-2 block">Search Patients</Label>
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              id="search"
              placeholder="Search by patient name..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <Card className="w-full lg:w-1/3">
          <CardHeader>
            <CardTitle>Patients</CardTitle>
            <CardDescription>
              Select a patient to create notes
            </CardDescription>
          </CardHeader>
          <CardContent className="max-h-[60vh] overflow-y-auto">
            {isLoading ? (
              <div className="space-y-2">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-12 bg-gray-100 animate-pulse rounded-md" />
                ))}
              </div>
            ) : filteredPatients && filteredPatients.length > 0 ? (
              <div className="space-y-2">
                {filteredPatients.map(patient => (
                  <div 
                    key={patient.id}
                    className={`p-3 rounded-md cursor-pointer border transition-colors ${
                      selectedPatient?.id === patient.id 
                        ? 'bg-primary/10 border-primary' 
                        : 'hover:bg-gray-50 border-transparent'
                    }`}
                    onClick={() => setSelectedPatient(patient)}
                  >
                    <h3 className="font-medium">{patient.name}</h3>
                    <p className="text-sm text-muted-foreground">ID: {patient.id}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-muted-foreground">No patients found</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="w-full lg:w-2/3">
          <CardHeader>
            <CardTitle>
              {selectedPatient 
                ? `Patient Notes - ${selectedPatient.name}` 
                : 'Select a patient to begin'}
            </CardTitle>
            <CardDescription>
              Record or type notes for the selected patient
            </CardDescription>
          </CardHeader>
          <CardContent>
            {selectedPatient ? (
              <div className="space-y-4">
                {permissionError && (
                  <Alert variant="destructive" className="mb-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Microphone Access Error</AlertTitle>
                    <AlertDescription>{permissionError}</AlertDescription>
                  </Alert>
                )}
                
                <div className="flex justify-center space-x-4">
                  {!isRecording ? (
                    <Button 
                      onClick={startRecording}
                      variant="outline"
                      className="space-x-2"
                    >
                      <Mic className="h-4 w-4" />
                      <span>Start Recording</span>
                    </Button>
                  ) : (
                    <Button 
                      onClick={stopRecording}
                      variant="destructive"
                      className="space-x-2"
                    >
                      <MicOff className="h-4 w-4" />
                      <span>Stop Recording</span>
                    </Button>
                  )}
                </div>
                
                {isRecording && (
                  <div className="text-center p-4 bg-red-50 rounded-md border border-red-200 animate-pulse">
                    <p className="font-semibold text-red-600">Recording in progress...</p>
                    <p className="text-sm text-red-500">Speak clearly into your microphone</p>
                  </div>
                )}
                
                <div>
                  <Label htmlFor="notes" className="mb-2 block">Patient Notes</Label>
                  <Textarea
                    id="notes"
                    value={recordedText}
                    onChange={(e) => setRecordedText(e.target.value)}
                    placeholder="Recorded text will appear here. You can also type directly."
                    className="min-h-[200px]"
                  />
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Select a patient from the list to create notes</p>
              </div>
            )}
          </CardContent>
          {selectedPatient && (
            <CardFooter className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={saveNote}
                disabled={!recordedText.trim()}
                className="space-x-2"
              >
                <Save className="h-4 w-4" />
                <span>Save Draft</span>
              </Button>
              <Button
                onClick={publishNote}
                disabled={!recordedText.trim()}
                className="space-x-2"
              >
                <Upload className="h-4 w-4" />
                <span>Publish to OpenDental</span>
              </Button>
            </CardFooter>
          )}
        </Card>
      </div>
    </div>
  );
}
