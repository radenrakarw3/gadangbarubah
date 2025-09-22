import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { HelmetProvider } from "react-helmet-async";
import { initializeAnalytics, trackPageView } from "@/lib/analytics";
import { useEffect } from "react";
import WelcomePage from "@/components/WelcomePage";
import UniPage from "@/components/UniPage";
import OutletPage from "@/components/services/OutletPage";
import DeliveryPage from "@/components/services/DeliveryPage";
import PartnershipPage from "@/components/services/PartnershipPage";
import CateringPage from "@/components/services/CateringPage";
import MemberLogin from "@/pages/MemberLogin";
import MemberRegister from "@/pages/MemberRegister";
import ComingSoon from "@/pages/ComingSoon";
import NotFound from "@/pages/not-found";

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
      <Route path="/member/dashboard" component={ComingSoon} />
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
