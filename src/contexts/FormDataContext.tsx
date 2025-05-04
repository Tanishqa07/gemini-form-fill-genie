
import React, { createContext, useState, useContext, useEffect } from "react";
import { toast } from "sonner";
import { useAuth } from "./AuthContext";

export interface UserDocument {
  id: string;
  name: string;
  type: string;
  fileData: string; // Base64 encoded data
  dateAdded: string;
}

export interface PersonalData {
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
}

interface FormDataContextType {
  personalData: PersonalData;
  documents: UserDocument[];
  updatePersonalData: (newData: Partial<PersonalData>) => void;
  addDocument: (document: Omit<UserDocument, "id" | "dateAdded">) => void;
  removeDocument: (id: string) => void;
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
  const { user } = useAuth();
  const [personalData, setPersonalData] = useState<PersonalData>(initialPersonalData);
  const [documents, setDocuments] = useState<UserDocument[]>([]);

  // Load user data from localStorage when user changes
  useEffect(() => {
    if (user) {
      const storedData = localStorage.getItem(`personalData-${user.id}`);
      const storedDocuments = localStorage.getItem(`documents-${user.id}`);
      
      if (storedData) {
        setPersonalData(JSON.parse(storedData));
      }
      
      if (storedDocuments) {
        setDocuments(JSON.parse(storedDocuments));
      }
    } else {
      // Reset state when logged out
      setPersonalData(initialPersonalData);
      setDocuments([]);
    }
  }, [user]);

  const updatePersonalData = (newData: Partial<PersonalData>) => {
    if (!user) {
      toast.error("You must be logged in to update personal data");
      return;
    }
    
    const updatedData = { ...personalData, ...newData };
    setPersonalData(updatedData);
    
    // Save to localStorage
    localStorage.setItem(`personalData-${user.id}`, JSON.stringify(updatedData));
    toast.success("Personal data updated successfully");
  };

  const addDocument = (document: Omit<UserDocument, "id" | "dateAdded">) => {
    if (!user) {
      toast.error("You must be logged in to add documents");
      return;
    }
    
    const newDocument: UserDocument = {
      ...document,
      id: crypto.randomUUID(),
      dateAdded: new Date().toISOString(),
    };
    
    const updatedDocuments = [...documents, newDocument];
    setDocuments(updatedDocuments);
    
    // Save to localStorage
    localStorage.setItem(`documents-${user.id}`, JSON.stringify(updatedDocuments));
    toast.success(`Document "${document.name}" added successfully`);
  };

  const removeDocument = (id: string) => {
    if (!user) {
      toast.error("You must be logged in to remove documents");
      return;
    }
    
    const updatedDocuments = documents.filter(doc => doc.id !== id);
    setDocuments(updatedDocuments);
    
    // Save to localStorage
    localStorage.setItem(`documents-${user.id}`, JSON.stringify(updatedDocuments));
    toast.success("Document removed successfully");
  };

  return (
    <FormDataContext.Provider
      value={{
        personalData,
        documents,
        updatePersonalData,
        addDocument,
        removeDocument,
      }}
    >
      {children}
    </FormDataContext.Provider>
  );
};

export const useFormData = () => {
  const context = useContext(FormDataContext);
  if (context === undefined) {
    throw new Error("useFormData must be used within a FormDataProvider");
  }
  return context;
};
