import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { TopBar } from "@/components/TopBar";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { WelcomeSection } from "./components/WelcomeSection"; // ✅ Import added

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <TopBar />
          <Routes>
            {/* Optional: Redirect / to /welcome */}
            <Route path="/" element={<Navigate to="/welcome" replace />} />
            <Route path="/welcome" element={<WelcomeSection />} />
            {/* Add more custom routes if needed */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
