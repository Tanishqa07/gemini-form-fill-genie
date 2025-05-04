
import React, { useEffect } from "react";
import { useSupabase } from "../contexts/SupabaseContext";
import LoginForm from "../components/LoginForm";
import Header from "../components/Header";
import { useNavigate } from "react-router-dom";

const Index: React.FC = () => {
  const { user, loading } = useSupabase();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && !loading) {
      navigate('/dashboard');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-lg font-medium">Loading...</h2>
          <p className="text-sm text-gray-500">Please wait</p>
        </div>
      </div>
    );
  }

  // If user is not logged in, show login page
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md mb-8 text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-primary rounded-xl p-3 text-white">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <path d="M9 14v1" />
                <path d="M9 8v1" />
                <path d="M9 11h6" />
                <path d="M15 14v1" />
                <path d="M12 14v4" />
                <path d="M12 8v3" />
                <path d="M15 8v1" />
              </svg>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-primary">FormFillGenie</h1>
          <p className="mt-2 text-gray-600">
            Your AI-powered form filling assistant
          </p>
        </div>
        
        <LoginForm />
        
        <div className="mt-12 max-w-lg text-center">
          <h2 className="text-xl font-semibold mb-4">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 bg-white rounded-lg shadow-sm">
              <div className="text-primary font-bold text-xl mb-2">1</div>
              <h3 className="font-medium mb-2">Store Your Information</h3>
              <p className="text-sm text-gray-600">
                Securely save your personal details and documents
              </p>
            </div>
            <div className="p-4 bg-white rounded-lg shadow-sm">
              <div className="text-primary font-bold text-xl mb-2">2</div>
              <h3 className="font-medium mb-2">AI Detection</h3>
              <p className="text-sm text-gray-600">
                Our AI recognizes form fields on any website
              </p>
            </div>
            <div className="p-4 bg-white rounded-lg shadow-sm">
              <div className="text-primary font-bold text-xl mb-2">3</div>
              <h3 className="font-medium mb-2">Auto-Fill Forms</h3>
              <p className="text-sm text-gray-600">
                Instantly fill forms with your saved information
              </p>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="bg-white py-4 border-t">
        <div className="container mx-auto px-4 text-center text-sm text-gray-500">
          <p>FormFillGenie • Your AI-powered form assistant</p>
          <p className="text-xs mt-1">Powered by Gemini API</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
