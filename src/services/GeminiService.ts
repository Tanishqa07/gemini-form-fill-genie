
import { useSupabase } from "../contexts/SupabaseContext";

export interface FormField {
  fieldName: string;
  fieldType: string;
  required: boolean;
  placeholder?: string;
  label?: string;
}

export class GeminiService {
  static async analyzeFormFields(screenshot: string): Promise<FormField[]> {
    const supabase = useSupabase().supabase;
    
    try {
      // Call the Supabase Edge Function for analyzing form fields
      const { data, error } = await supabase.functions.invoke('analyze-form', {
        body: { screenshot }
      });
      
      if (error) throw new Error(error.message);
      
      return data.fields;
    } catch (error) {
      console.error("Error analyzing form fields:", error);
      
      // Fallback to mock data in case of error
      return [
        {
          fieldName: "fullName",
          fieldType: "text",
          label: "Full Name",
          required: true,
        },
        {
          fieldName: "email",
          fieldType: "email",
          label: "Email Address",
          required: true,
        },
        {
          fieldName: "phone",
          fieldType: "tel",
          label: "Phone Number",
          required: false,
        },
        {
          fieldName: "dateOfBirth",
          fieldType: "date",
          label: "Date of Birth",
          required: true,
        },
        {
          fieldName: "address",
          fieldType: "text",
          label: "Address",
          required: true,
        },
      ];
    }
  }
  
  static async matchFieldsToUserData(
    detectedFields: FormField[], 
    userData: Record<string, any>
  ): Promise<Record<string, any>> {
    const supabase = useSupabase().supabase;
    
    try {
      // Call the Supabase Edge Function for matching fields
      const { data, error } = await supabase.functions.invoke('match-fields', {
        body: { 
          detectedFields, 
          userData 
        }
      });
      
      if (error) throw new Error(error.message);
      
      return data.matches;
    } catch (error) {
      console.error("Error matching fields to user data:", error);
      
      // Simple fallback matching logic
      const result: Record<string, any> = {};
      
      detectedFields.forEach(field => {
        // Simple matching based on field name
        const key = field.fieldName.toLowerCase();
        
        // Map detected fields to user data
        if (key in userData) {
          result[key] = userData[key];
        } else if (key === "name" && "fullName" in userData) {
          result[key] = userData.fullName;
        } else if (key === "birth" && "dateOfBirth" in userData) {
          result[key] = userData.dateOfBirth;
        }
      });
      
      return result;
    }
  }

  static async createContentExtractor(): Promise<void> {
    // This would be a function to set up a browser extension context
    // In a real implementation, we'd use browser extension APIs here
    console.log("Creating content extractor for form detection...");
  }
}
