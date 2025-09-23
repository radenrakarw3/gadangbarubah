import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { HelmetProvider } from "react-helmet-async";
import { initializeAnalytics, trackPageView } from "@/lib/analytics";
import { useEffect, useState } from "react";
import WelcomePage from "@/components/WelcomePage";
import UniPage from "@/components/UniPage";
import OutletPage from "@/components/services/OutletPage";
import DeliveryPage from "@/components/services/DeliveryPage";
import PartnershipPage from "@/components/services/PartnershipPage";
import CateringPage from "@/components/services/CateringPage";
import MemberLogin from "@/pages/MemberLogin";
import MemberRegister from "@/pages/MemberRegister";
import MemberDashboard from "@/pages/MemberDashboard";
import AdminDashboard from "@/pages/AdminDashboard";
import AdminVouchers from "@/pages/AdminVouchers";
import AdminPromos from "@/pages/AdminPromos";
import AdminMembers from "@/pages/AdminMembers";
import AdminBills from "@/pages/AdminBills";
import KasirDashboard from "@/pages/KasirDashboard";
import LoginAdmin from "@/components/LoginAdmin";
import LoginKasir from "@/components/LoginKasir";
import NotFound from "@/pages/not-found";

// Protected Admin Route Component
function ProtectedAdminRoute() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const adminAuth = localStorage.getItem('adminAuth');
    setIsAuthenticated(adminAuth === 'true');
    setIsLoading(false);
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  if (isLoading) return <div>Loading...</div>;

  if (!isAuthenticated) {
    return <LoginAdmin onLogin={handleLogin} />;
  }

  return <AdminDashboard />;
}

// Protected Kasir Route Component
function ProtectedKasirRoute() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const kasirAuth = localStorage.getItem('kasirAuth');
    setIsAuthenticated(kasirAuth === 'true');
    setIsLoading(false);
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  if (isLoading) return <div>Loading...</div>;

  if (!isAuthenticated) {
    return <LoginKasir onLogin={handleLogin} />;
  }

  return <KasirDashboard />;
}


function Router() {
  const [location] = useLocation();
  
  // Track page views for SPA navigation
  useEffect(() => {
    trackPageView({
      path: location,
      title: document.title
    });
  }, [location]);
  
  return (
    <Switch>
      <Route path="/" component={WelcomePage} />
      <Route path="/uni" component={UniPage} />
      <Route path="/services/outlet" component={OutletPage} />
      <Route path="/services/delivery" component={DeliveryPage} />
      <Route path="/services/partnership" component={PartnershipPage} />
      <Route path="/services/membership" component={MemberLogin} />
      <Route path="/services/catering" component={CateringPage} />
      <Route path="/member/login" component={MemberLogin} />
      <Route path="/member/register" component={MemberRegister} />
      <Route path="/member/dashboard" component={MemberDashboard} />
      <Route path="/admin" component={ProtectedAdminRoute} />
      <Route path="/admin/vouchers" component={AdminVouchers} />
      <Route path="/admin/promos" component={AdminPromos} />
      <Route path="/admin/members" component={AdminMembers} />
      <Route path="/admin/bills" component={AdminBills} />
      <Route path="/kasir" component={ProtectedKasirRoute} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  // Initialize analytics once on app load
  useEffect(() => {
    initializeAnalytics();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <HelmetProvider>
          <Toaster />
          <Router />
        </HelmetProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
