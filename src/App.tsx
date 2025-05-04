
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { FormDataProvider } from "./contexts/FormDataContext";
import Dashboard from "./pages/Dashboard";
import { SupabaseProvider } from "./contexts/SupabaseContext";

const queryClient = new QueryClient();

// Set Supabase environment variables
if (!import.meta.env.VITE_SUPABASE_URL) {
  window.VITE_SUPABASE_URL = "https://fszdehjytxsuqzfllroq.supabase.co";
}

if (!import.meta.env.VITE_SUPABASE_ANON_KEY) {
  window.VITE_SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZzemRlaGp5dHhzdXF6Zmxscm9xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYzNDY2NTQsImV4cCI6MjA2MTkyMjY1NH0.ynIl8x4ExJDmrePHeJwueRQ-M-uz2quWQn8yqFo2YQs";
}

// Check if Supabase environment variables are set
const isSupabaseConfigured = 
  window.VITE_SUPABASE_URL && 
  window.VITE_SUPABASE_ANON_KEY;

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <SupabaseProvider>
        {!isSupabaseConfigured && (
          <div className="fixed top-0 left-0 right-0 bg-red-500 text-white p-2 text-center z-50">
            Supabase environment variables missing. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.
          </div>
        )}
        <FormDataProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/dashboard" element={<Dashboard />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </FormDataProvider>
      </SupabaseProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
