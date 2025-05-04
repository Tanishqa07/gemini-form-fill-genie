
import React, { createContext, useState, useContext, useEffect } from "react";
import { toast } from "sonner";
import { useSupabase } from "./SupabaseContext";

export interface UserDocument {
  id: string;
  name: string;
  type: string;
  fileData: string; // Base64 encoded data or URL to Supabase storage
  dateAdded: string;
  user_id: string;
}

export interface PersonalData {
  id?: string;
  user_id?: string;
  fullName: string;
  fatherName: string;
  motherName: string;
  dateOfBirth: string;
  gender: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  school: string;
  college: string;
  degree: string;
  graduationYear: string;
  gpa: string;
  created_at?: string;
  updated_at?: string;
}

export interface FormFieldHistory {
  id: string;
  user_id: string;
  website_url: string;
  field_name: string;
  field_value: string;
  field_type: string;
  date_filled: string;
  form_title?: string;
}

interface FormDataContextType {
  personalData: PersonalData;
  documents: UserDocument[];
  formHistory: FormFieldHistory[];
  updatePersonalData: (newData: Partial<PersonalData>) => Promise<void>;
  addDocument: (document: Omit<UserDocument, "id" | "dateAdded" | "user_id">) => Promise<void>;
  removeDocument: (id: string) => Promise<void>;
  fillFormField: (fieldData: Omit<FormFieldHistory, "id" | "user_id" | "date_filled">) => Promise<void>;
  isLoading: boolean;
}

const FormDataContext = createContext<FormDataContextType | undefined>(undefined);

const initialPersonalData: PersonalData = {
  fullName: "",
  fatherName: "",
  motherName: "",
  dateOfBirth: "",
  gender: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  state: "",
  country: "",
  postalCode: "",
  school: "",
  college: "",
  degree: "",
  graduationYear: "",
  gpa: "",
};

export const FormDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { supabase, user } = useSupabase();
  const [personalData, setPersonalData] = useState<PersonalData>(initialPersonalData);
  const [documents, setDocuments] = useState<UserDocument[]>([]);
  const [formHistory, setFormHistory] = useState<FormFieldHistory[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load user data from Supabase when user changes
  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) {
        // Reset state when logged out
        setPersonalData(initialPersonalData);
        setDocuments([]);
        setFormHistory([]);
        return;
      }

      setIsLoading(true);
      try {
        // Fetch personal data
        const { data: personalDataResult, error: personalDataError } = await supabase
          .from('personal_data')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (personalDataError && personalDataError.code !== 'PGRST116') {
          // PGRST116 is "not found" which is okay for new users
          console.error('Error fetching personal data:', personalDataError);
          toast.error('Failed to load personal data');
        } else if (personalDataResult) {
          setPersonalData(personalDataResult);
        }

        // Fetch documents
        const { data: documentsResult, error: documentsError } = await supabase
          .from('documents')
          .select('*')
          .eq('user_id', user.id)
          .order('dateAdded', { ascending: false });

        if (documentsError) {
          console.error('Error fetching documents:', documentsError);
          toast.error('Failed to load documents');
        } else {
          setDocuments(documentsResult || []);
        }

        // Fetch form history
        const { data: historyResult, error: historyError } = await supabase
          .from('form_history')
          .select('*')
          .eq('user_id', user.id)
          .order('date_filled', { ascending: false });

        if (historyError) {
          console.error('Error fetching form history:', historyError);
          toast.error('Failed to load form history');
        } else {
          setFormHistory(historyResult || []);
        }
      } catch (error) {
        console.error('Error in fetchUserData:', error);
        toast.error('Failed to load user data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [user, supabase]);

  const updatePersonalData = async (newData: Partial<PersonalData>) => {
    if (!user) {
      toast.error('You must be logged in to update personal data');
      return;
    }

    setIsLoading(true);
    try {
      const updatedData = { ...personalData, ...newData, user_id: user.id };
      
      if (personalData.id) {
        // Update existing record
        const { error } = await supabase
          .from('personal_data')
          .update(updatedData)
          .eq('id', personalData.id);
          
        if (error) throw error;
      } else {
        // Insert new record
        const { error, data } = await supabase
          .from('personal_data')
          .insert(updatedData)
          .select();
          
        if (error) throw error;
        if (data && data.length > 0) {
          updatedData.id = data[0].id;
        }
      }
      
      setPersonalData(updatedData);
      toast.success('Personal data updated successfully');
    } catch (error: any) {
      console.error('Error updating personal data:', error);
      toast.error(`Failed to update personal data: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const addDocument = async (document: Omit<UserDocument, "id" | "dateAdded" | "user_id">) => {
    if (!user) {
      toast.error('You must be logged in to add documents');
      return;
    }
    
    setIsLoading(true);
    try {
      // Extract the base64 data and file extension
      const base64Data = document.fileData;
      const fileType = base64Data.split(';')[0].split('/')[1];
      
      // Convert base64 to file
      const base64Response = await fetch(base64Data);
      const blob = await base64Response.blob();
      const file = new File([blob], `${document.name}.${fileType}`, { type: blob.type });
      
      // Upload to Supabase Storage
      const filePath = `${user.id}/${Date.now()}-${file.name}`;
      const { error: uploadError, data: uploadData } = await supabase
        .storage
        .from('documents')
        .upload(filePath, file);
        
      if (uploadError) throw uploadError;
      
      // Get the public URL for the uploaded file
      const { data: urlData } = supabase
        .storage
        .from('documents')
        .getPublicUrl(filePath);
        
      const fileUrl = urlData.publicUrl;
      
      // Create the document record in the database
      const newDocumentRecord = {
        name: document.name,
        type: document.type,
        fileData: fileUrl,
        dateAdded: new Date().toISOString(),
        user_id: user.id
      };
      
      const { error: dbError, data: dbData } = await supabase
        .from('documents')
        .insert(newDocumentRecord)
        .select();
        
      if (dbError) throw dbError;
      
      if (dbData && dbData.length > 0) {
        // Add the new document to the state
        setDocuments([...documents, dbData[0]]);
      }
      
      toast.success(`Document "${document.name}" added successfully`);
    } catch (error: any) {
      console.error('Error adding document:', error);
      toast.error(`Failed to add document: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const removeDocument = async (id: string) => {
    if (!user) {
      toast.error('You must be logged in to remove documents');
      return;
    }
    
    setIsLoading(true);
    try {
      // Get the document to be deleted
      const docToDelete = documents.find(doc => doc.id === id);
      if (!docToDelete) throw new Error('Document not found');
      
      // Delete the document from Supabase Storage if it has a URL
      if (docToDelete.fileData && docToDelete.fileData.includes('supabase')) {
        // Extract the file path from the URL
        const url = new URL(docToDelete.fileData);
        const pathParts = url.pathname.split('/');
        const filePath = pathParts.slice(pathParts.indexOf('documents') + 1).join('/');
        
        // Delete from storage
        const { error: storageError } = await supabase
          .storage
          .from('documents')
          .remove([filePath]);
          
        if (storageError) console.error('Error deleting file from storage:', storageError);
      }
      
      // Delete from database
      const { error } = await supabase
        .from('documents')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      // Update state
      setDocuments(documents.filter(doc => doc.id !== id));
      toast.success('Document removed successfully');
    } catch (error: any) {
      console.error('Error removing document:', error);
      toast.error(`Failed to remove document: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const fillFormField = async (fieldData: Omit<FormFieldHistory, "id" | "user_id" | "date_filled">) => {
    if (!user) {
      toast.error('You must be logged in to save form field history');
      return;
    }

    try {
      const historyRecord = {
        ...fieldData,
        user_id: user.id,
        date_filled: new Date().toISOString(),
      };

      const { error, data } = await supabase
        .from('form_history')
        .insert(historyRecord)
        .select();

      if (error) throw error;
      
      if (data && data.length > 0) {
        setFormHistory([data[0], ...formHistory]);
      }
    } catch (error: any) {
      console.error('Error saving form field history:', error);
      // Don't show toast for this operation as it happens in the background
    }
  };

  return (
    <FormDataContext.Provider
      value={{
        personalData,
        documents,
        formHistory,
        updatePersonalData,
        addDocument,
        removeDocument,
        fillFormField,
        isLoading
      }}
    >
      {children}
    </FormDataContext.Provider>
  );
};

export const useFormData = () => {
  const context = useContext(FormDataContext);
  if (context === undefined) {
    throw new Error('useFormData must be used within a FormDataProvider');
  }
  return context;
};
