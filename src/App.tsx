import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { FinancialProvider } from "@/contexts/FinancialContext";
import { AppLayout } from "@/components/layout/AppLayout";
import Dashboard from "./pages/Dashboard";
import AnalysisPage from "./pages/AnalysisPage";
import FinancialDashboard from "./pages/FinancialDashboard";
import InsightsPage from "./pages/InsightsPage";
import AlertsPage from "./pages/AlertsPage";
import SettingsPage from "./pages/SettingsPage";
import ChatPage from "./pages/ChatPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <FinancialProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppLayout>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/analysis" element={<AnalysisPage />} />
                <Route path="/financial-dashboard" element={<FinancialDashboard />} />
                <Route path="/insights" element={<InsightsPage />} />
                <Route path="/alerts" element={<AlertsPage />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="/chat" element={<ChatPage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </AppLayout>
          </BrowserRouter>
        </TooltipProvider>
      </FinancialProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
