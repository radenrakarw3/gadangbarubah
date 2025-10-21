import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { HelmetProvider } from "react-helmet-async";
import { initializeAnalytics, trackPageView } from "@/lib/analytics";
import { useEffect, useState } from "react";
import WelcomePage from "@/components/WelcomePage";
import OutletPage from "@/components/services/OutletPage";
import DeliveryPage from "@/components/services/DeliveryPage";
import PartnershipPage from "@/components/services/PartnershipPage";
import MembershipPage from "@/components/services/MembershipPage";
import CateringPage from "@/components/services/CateringPage";
import MemberLogin from "@/pages/MemberLogin";
import MemberRegister from "@/pages/MemberRegister";
import MemberDashboard from "@/pages/MemberDashboard";
import AdminDashboard from "@/pages/AdminDashboard";
import AdminVouchers from "@/pages/AdminVouchers";
import AdminPromos from "@/pages/AdminPromos";
import AdminMembers from "@/pages/AdminMembers";
import AdminBills from "@/pages/AdminBills";
import AdminCampaigns from "@/pages/AdminCampaigns";
import KasirDashboard from "@/pages/KasirDashboard";
import LoginAdmin from "@/components/LoginAdmin";
import LoginKasir from "@/components/LoginKasir";
import ScrollToTop from "@/components/ScrollToTop";
import NotFound from "@/pages/not-found";

// Generic Protected Route Component
interface ProtectedRouteProps {
  role: 'admin' | 'kasir';
  component: React.ComponentType;
  loginComponent: React.ComponentType<{ onLogin: () => void }>;
}

function ProtectedRoute({ role, component: Component, loginComponent: LoginComponent }: ProtectedRouteProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [recheckTrigger, setRecheckTrigger] = useState(0);

  useEffect(() => {
    // Check session with backend
    const checkSession = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/auth/session', {
          credentials: 'include',
        });
        
        if (response.ok) {
          const data = await response.json();
          setIsAuthenticated(data.authenticated && data.user?.role === role);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Session check failed:', error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
  }, [role, recheckTrigger]);

  const handleLogin = () => {
    // Re-verify session after login to ensure role matches
    setRecheckTrigger(prev => prev + 1);
  };

  if (isLoading) return <div>Loading...</div>;

  if (!isAuthenticated) {
    return <LoginComponent onLogin={handleLogin} />;
  }

  return <Component />;
}

// Protected Admin Route Component
function ProtectedAdminRoute() {
  return <ProtectedRoute role="admin" component={AdminDashboard} loginComponent={LoginAdmin} />;
}

// Protected Kasir Route Component
function ProtectedKasirRoute() {
  return <ProtectedRoute role="kasir" component={KasirDashboard} loginComponent={LoginKasir} />;
}

// Protected Admin Sub-Routes
function ProtectedAdminVouchers() {
  return <ProtectedRoute role="admin" component={AdminVouchers} loginComponent={LoginAdmin} />;
}

function ProtectedAdminPromos() {
  return <ProtectedRoute role="admin" component={AdminPromos} loginComponent={LoginAdmin} />;
}

function ProtectedAdminMembers() {
  return <ProtectedRoute role="admin" component={AdminMembers} loginComponent={LoginAdmin} />;
}

function ProtectedAdminBills() {
  return <ProtectedRoute role="admin" component={AdminBills} loginComponent={LoginAdmin} />;
}

function ProtectedAdminCampaigns() {
  return <ProtectedRoute role="admin" component={AdminCampaigns} loginComponent={LoginAdmin} />;
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
      <Route path="/services/outlet" component={OutletPage} />
      <Route path="/services/delivery" component={DeliveryPage} />
      <Route path="/services/partnership" component={PartnershipPage} />
      <Route path="/services/membership" component={MembershipPage} />
      <Route path="/services/catering" component={CateringPage} />
      <Route path="/member/login" component={MemberLogin} />
      <Route path="/member/register" component={MemberRegister} />
      <Route path="/member/dashboard" component={MemberDashboard} />
      <Route path="/admin" component={ProtectedAdminRoute} />
      <Route path="/admin/vouchers" component={ProtectedAdminVouchers} />
      <Route path="/admin/promos" component={ProtectedAdminPromos} />
      <Route path="/admin/campaigns" component={ProtectedAdminCampaigns} />
      <Route path="/admin/members" component={ProtectedAdminMembers} />
      <Route path="/admin/bills" component={ProtectedAdminBills} />
      <Route path="/kasir" component={ProtectedKasirRoute} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  // Initialize analytics once on app load
  useEffect(() => {
    initializeAnalytics();
    
    // Disable browser scroll restoration to prevent unwanted scroll positions
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
    
    // Cleanup on unmount (optional)
    return () => {
      if ('scrollRestoration' in history) {
        history.scrollRestoration = 'auto';
      }
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <HelmetProvider>
          <ScrollToTop />
          <Toaster />
          <Router />
        </HelmetProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
