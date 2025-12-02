import { useState } from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ConnectModal } from "@/components/ConnectModal";
import HomePage from "@/pages/home";
import SermonsPage from "@/pages/sermons";
import SermonDetailPage from "@/pages/sermon-detail";
import AnnouncementsPage from "@/pages/announcements";
import AboutPage from "@/pages/about";
import ContactPage from "@/pages/contact";
import AdminLoginPage from "@/pages/admin-login";
import AdminDashboardPage from "@/pages/admin-dashboard";
import NotFound from "@/pages/not-found";

function Router({ onConnectClick }: { onConnectClick: () => void }) {
  return (
    <Switch>
      <Route path="/" component={() => <HomePage onConnectClick={onConnectClick} />} />
      <Route path="/sermons" component={SermonsPage} />
      <Route path="/sermons/:id" component={SermonDetailPage} />
      <Route path="/announcements" component={AnnouncementsPage} />
      <Route path="/about" component={AboutPage} />
      <Route path="/contact" component={ContactPage} />
      <Route path="/admin/login" component={AdminLoginPage} />
      <Route path="/admin/dashboard" component={AdminDashboardPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [connectModalOpen, setConnectModalOpen] = useState(false);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <div className="min-h-screen flex flex-col">
            <Navbar onConnectClick={() => setConnectModalOpen(true)} />
            <div className="flex-1">
              <Router onConnectClick={() => setConnectModalOpen(true)} />
            </div>
            <Footer />
          </div>
          <ConnectModal open={connectModalOpen} onOpenChange={setConnectModalOpen} />
          <Toaster />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
