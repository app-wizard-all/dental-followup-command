
import { Layout } from "@/components/Layout";
import { HelpGuideTabs } from "@/components/HelpGuideTabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileUp, Printer } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useState } from "react";
import { toast } from "sonner";

const HelpGuide = () => {
  const [activeTab, setActiveTab] = useState<"guides" | "pdf-upload">("guides");

  return (
    <Layout>
      <Card className="mb-6 shadow-md">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold text-dental-charcoal">DentalTrack Help Center</CardTitle>
              <CardDescription className="text-dental-gray font-medium">
                Find guides and upload reference materials for front desk procedures
              </CardDescription>
            </div>
            <Button 
              variant="outline" 
              className="border-dental-teal text-dental-teal hover:bg-dental-teal/10"
              onClick={() => setActiveTab(activeTab === "guides" ? "pdf-upload" : "guides")}
            >
              {activeTab === "guides" ? (
                <>
                  <FileUp className="h-4 w-4 mr-2" />
                  Upload PDF
                </>
              ) : (
                "View Guides"
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "guides" | "pdf-upload")}>
            <TabsContent value="guides" className="m-0">
              <HelpGuideTabs />
            </TabsContent>
            <TabsContent value="pdf-upload" className="m-0 p-6">
              <PdfUploadSection />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </Layout>
  );
};

const PdfUploadSection = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("phone-calls");
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      
      // Create URL for preview
      const fileUrl = URL.createObjectURL(file);
      setPreview(fileUrl);
    }
  };

  const handleUpload = () => {
    if (!selectedFile) return;
    
    setUploading(true);
    
    // In a real app, you would upload the file to a server here
    // For this example, we'll simulate a successful upload after a delay
    setTimeout(() => {
      setUploading(false);
      setSelectedFile(null);
      setPreview(null);
      // Show success message
      toast.success(`PDF uploaded successfully to ${selectedCategory} category!`);
    }, 1500);
  };

  const handlePrint = () => {
    if (!preview) return;
    
    // Open PDF in new window for printing
    const printWindow = window.open(preview, '_blank');
    if (printWindow) {
      printWindow.onload = () => {
        printWindow.print();
      };
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <h3 className="text-lg font-semibold mb-4 text-dental-charcoal">Upload New Resource</h3>
          <div className="space-y-4">
            <div>
              <Label className="text-dental-charcoal font-medium">Select Category</Label>
              <select 
                className="w-full p-2 border rounded-md mt-1 text-dental-charcoal" 
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="phone-calls">Phone Calls</option>
                <option value="new-patients">New Patients</option>
                <option value="follow-ups">Follow Ups</option>
                <option value="checkout">Checkout Process</option>
                <option value="consents">Consent Forms</option>
                <option value="scheduling">Scheduling</option>
                <option value="operations">Daily Operations</option>
              </select>
            </div>
            
            <div>
              <Label className="text-dental-charcoal font-medium">Upload PDF</Label>
              <div className="border-2 border-dashed border-dental-teal/50 rounded-md p-6 text-center mt-1 hover:bg-dental-teal/5 transition-colors">
                <input
                  type="file"
                  accept=".pdf"
                  className="hidden"
                  id="pdf-upload"
                  onChange={handleFileChange}
                />
                <label htmlFor="pdf-upload" className="cursor-pointer">
                  <FileUp className="mx-auto h-12 w-12 text-dental-teal" />
                  <p className="mt-2 text-sm text-dental-charcoal font-medium">Click to upload or drag and drop</p>
                  <p className="text-xs text-dental-gray">PDF files only (max 10MB)</p>
                </label>
                {selectedFile && (
                  <div className="mt-2 text-sm text-dental-teal font-medium">
                    Selected: {selectedFile.name}
                  </div>
                )}
              </div>
            </div>
            
            <Button
              className="w-full bg-dental-teal hover:bg-dental-teal/90"
              disabled={!selectedFile || uploading}
              onClick={handleUpload}
            >
              {uploading ? "Uploading..." : "Upload PDF to Guide"}
            </Button>
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold mb-4 text-dental-charcoal">Preview</h3>
          <div className="border rounded-md h-[400px] flex items-center justify-center bg-gray-50 overflow-hidden">
            {preview ? (
              <iframe 
                src={preview} 
                className="w-full h-full" 
                title="PDF Preview"
              />
            ) : (
              <p className="text-dental-gray font-medium">PDF preview will appear here</p>
            )}
          </div>
          {preview && (
            <Button
              variant="outline"
              className="mt-4 border-dental-teal text-dental-teal hover:bg-dental-teal/10"
              onClick={handlePrint}
            >
              <Printer className="h-4 w-4 mr-2" />
              Print PDF
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default HelpGuide;
