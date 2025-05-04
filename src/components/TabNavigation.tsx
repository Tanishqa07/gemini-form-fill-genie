
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import PersonalInfoForm from "./PersonalInfoForm";
import DocumentUpload from "./DocumentUpload";
import FormFillDemo from "./FormFillDemo";
import FormHistory from "./FormHistory";

const TabNavigation: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState("personal-info");

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid grid-cols-4 w-full mb-6">
        <TabsTrigger value="personal-info">Personal Info</TabsTrigger>
        <TabsTrigger value="documents">Documents</TabsTrigger>
        <TabsTrigger value="form-history">Form History</TabsTrigger>
        <TabsTrigger value="demo">Form Fill Demo</TabsTrigger>
      </TabsList>
      
      <TabsContent value="personal-info">
        <PersonalInfoForm />
      </TabsContent>
      
      <TabsContent value="documents">
        <DocumentUpload />
      </TabsContent>
      
      <TabsContent value="form-history">
        <FormHistory />
      </TabsContent>
      
      <TabsContent value="demo">
        <FormFillDemo />
      </TabsContent>
    </Tabs>
  );
};

export default TabNavigation;
