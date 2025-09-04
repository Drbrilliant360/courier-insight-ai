import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppLayout } from "./components/AppLayout";
import Dashboard from "./pages/Dashboard";
import DataUpload from "./pages/DataUpload";
import MapView from "./pages/MapView";
import Analytics from "./pages/Analytics";
import ETAPrediction from "./pages/ETAPrediction";
import AnomalyDetection from "./pages/AnomalyDetection";
import Leaderboard from "./pages/Leaderboard";
import Chatbot from "./pages/Chatbot";
import Reports from "./pages/Reports";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AppLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="upload" element={<DataUpload />} />
            <Route path="map" element={<MapView />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="eta" element={<ETAPrediction />} />
            <Route path="anomaly" element={<AnomalyDetection />} />
            <Route path="leaderboard" element={<Leaderboard />} />
            <Route path="chatbot" element={<Chatbot />} />
            <Route path="reports" element={<Reports />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
