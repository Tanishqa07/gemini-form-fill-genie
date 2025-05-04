
import React, { useState } from "react";
import { useFormData } from "../contexts/FormDataContext";
import { GeminiService } from "../services/GeminiService";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { toast } from "sonner";
import { Skeleton } from "./ui/skeleton";

interface DetectedField {
  fieldName: string;
  fieldType: string;
  label?: string;
  required: boolean;
}

const FormFillDemo: React.FC = () => {
  const { personalData } = useFormData();
  const [isScanning, setIsScanning] = useState(false);
  const [isMatching, setIsMatching] = useState(false);
  const [detectedFields, setDetectedFields] = useState<DetectedField[]>([]);
  const [filledData, setFilledData] = useState<Record<string, string>>({});

  const handleScan = async () => {
    setIsScanning(true);
    try {
      // In a real extension, this would capture a screenshot
      // For demo, we'll simulate with a mock screenshot
      const mockScreenshot = "data:image/png;base64,iVBORw0KGgo...";
      
      // Analyze form fields with Gemini API
      const fields = await GeminiService.analyzeFormFields(mockScreenshot);
      setDetectedFields(fields);
      
      toast.success("Form fields detected successfully!");
    } catch (error) {
      toast.error("Error detecting form fields");
    } finally {
      setIsScanning(false);
    }
  };

  const handleFill = async () => {
    setIsMatching(true);
    try {
      // Match detected fields with user data
      const mappedData = await GeminiService.matchFieldsToUserData(
        detectedFields,
        personalData
      );
      
      setFilledData(mappedData);
      toast.success("Form data mapped successfully!");
    } catch (error) {
      toast.error("Error mapping form data");
    } finally {
      setIsMatching(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Form Fill Demo</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            This demo simulates how FormFillGenie would work on an actual webpage.
            In a real Chrome extension, the AI would automatically detect form fields
            and fill them with your saved data.
          </p>

          <div className="flex justify-between gap-4">
            <Button 
              onClick={handleScan} 
              disabled={isScanning} 
              className="flex-1"
            >
              {isScanning ? "Scanning..." : "Scan Form Fields"}
            </Button>
            
            <Button 
              onClick={handleFill} 
              disabled={isMatching || detectedFields.length === 0} 
              className="flex-1"
            >
              {isMatching ? "Filling..." : "Auto-Fill Form"}
            </Button>
          </div>
        </div>

        {/* Mock Form */}
        <div className="border rounded-lg p-4">
          <h3 className="text-lg font-medium mb-4">Sample Form</h3>
          
          {isScanning ? (
            <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : (
            <div className="space-y-4">
              {detectedFields.length > 0 ? (
                detectedFields.map((field, index) => (
                  <div key={index} className="space-y-2">
                    <Label htmlFor={`demo-${field.fieldName}`}>{field.label || field.fieldName}</Label>
                    <Input
                      id={`demo-${field.fieldName}`}
                      type={field.fieldType}
                      value={filledData[field.fieldName.toLowerCase()] || ""}
                      onChange={() => {}} // Read-only for demo
                      placeholder={field.label || field.fieldName}
                      className={filledData[field.fieldName.toLowerCase()] ? "bg-primary-100 border-primary-300" : ""}
                    />
                  </div>
                ))
              ) : (
                <div className="text-center p-6 border-2 border-dashed rounded-lg">
                  <p className="text-muted-foreground">
                    Click "Scan Form Fields" to detect form elements
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg text-sm">
          <p className="font-medium">How it works in the real extension:</p>
          <ol className="list-decimal pl-5 space-y-1 mt-2">
            <li>The extension analyzes the current webpage using Gemini AI</li>
            <li>It identifies form fields and their likely purpose</li>
            <li>It matches these fields with your stored personal information</li>
            <li>It automatically fills in the forms with the correct data</li>
            <li>You can review and submit the form with one click</li>
          </ol>
        </div>
      </CardContent>
    </Card>
  );
};

export default FormFillDemo;
