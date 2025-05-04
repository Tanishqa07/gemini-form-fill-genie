
import React from "react";
import Header from "../components/Header";
import TabNavigation from "../components/TabNavigation";

const Dashboard: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 container mx-auto py-8 px-4">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">FormFillGenie Dashboard</h1>
          <p className="text-gray-500">
            Manage your information and documents for automatic form filling
          </p>
        </div>
        
        <TabNavigation />
      </main>
      
      <footer className="bg-gray-50 py-4 border-t">
        <div className="container mx-auto px-4 text-center text-sm text-gray-500">
          <p>FormFillGenie • Your AI-powered form assistant</p>
          <p className="text-xs mt-1">Powered by Gemini API</p>
        </footer>
      </div>
    </div>
  );
};

export default Dashboard;
