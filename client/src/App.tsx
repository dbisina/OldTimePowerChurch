import { useState, useEffect } from "react";
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

// Check if we're on the admin subdomain
function isAdminSubdomain(): boolean {
  const hostname = window.location.hostname;
  return hostname.startsWith('admin.') || hostname === 'admin';
}

// Redirect to admin subdomain
function RedirectToAdmin() {
  useEffect(() => {
    const hostname = window.location.hostname;
    const protocol = window.location.protocol;
    const port = window.location.port ? `:${window.location.port}` : '';
    
    // Avoid redirect loop if already on admin
    if (isAdminSubdomain()) return;

    let newHostname = `admin.${hostname}`;
    // Handle www
    if (hostname.startsWith('www.')) {
      newHostname = `admin.${hostname.slice(4)}`;
    }
    
    // Map /admin/login -> /login, /admin/dashboard -> /dashboard
    const path = window.location.pathname.replace(/^\/admin/, '') || '/';
    
    window.location.href = `${protocol}//${newHostname}${port}${path}`;
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-pulse">Redirecting to admin dashboard...</div>
    </div>
  );
}

// Public website routes
function PublicRouter({ onConnectClick }: { onConnectClick: () => void }) {
  return (
    <Switch>
      <Route path="/" component={() => <HomePage onConnectClick={onConnectClick} />} />
      <Route path="/sermons" component={SermonsPage} />
      <Route path="/sermons/:slug" component={SermonDetailPage} />
      <Route path="/announcements" component={AnnouncementsPage} />
      <Route path="/about" component={AboutPage} />
      <Route path="/contact" component={ContactPage} />
      {/* Redirect legacy admin routes to subdomain */}
      <Route path="/admin/login" component={RedirectToAdmin} />
      <Route path="/admin/dashboard" component={RedirectToAdmin} />
      <Route component={NotFound} />
    </Switch>
  );
}

// Admin subdomain routes (admin.domain.com)
function AdminRouter() {
  return (
    <Switch>
      <Route path="/" component={AdminLoginPage} />
      <Route path="/login" component={AdminLoginPage} />
      <Route path="/dashboard" component={AdminDashboardPage} />
      <Route component={AdminLoginPage} />
    </Switch>
  );
}

// Public website layout with navbar and footer
function PublicLayout({ children, onConnectClick }: { children: React.ReactNode; onConnectClick: () => void }) {
  const [connectModalOpen, setConnectModalOpen] = useState(false);
  
  return (
    <>
      <div className="min-h-screen flex flex-col">
        <Navbar onConnectClick={() => setConnectModalOpen(true)} />
        <div className="flex-1">
          {children}
        </div>
        <Footer />
      </div>
      <ConnectModal open={connectModalOpen} onOpenChange={setConnectModalOpen} />
    </>
  );
}

// Admin layout (no navbar/footer - cleaner admin experience)
function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      {children}
    </div>
  );
}

function App() {
  const [connectModalOpen, setConnectModalOpen] = useState(false);
  const isAdmin = isAdminSubdomain();

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          {isAdmin ? (
            <AdminLayout>
              <AdminRouter />
            </AdminLayout>
          ) : (
            <PublicLayout onConnectClick={() => setConnectModalOpen(true)}>
              <PublicRouter onConnectClick={() => setConnectModalOpen(true)} />
            </PublicLayout>
          )}
          <Toaster />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
