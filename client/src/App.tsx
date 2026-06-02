import { Switch, Route, useLocation, useRoute } from "wouter";
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
import AdminDashboard from "@/pages/AdminDashboard";
import AdminCampaigns from "@/pages/AdminCampaigns";
import AdminUsers from "@/pages/AdminUsers";
import AdminReservations from "@/pages/AdminReservations";
import LoginAdmin from "@/components/LoginAdmin";
import ScrollToTop from "@/components/ScrollToTop";
import NotFound from "@/pages/not-found";
import AboutPage from "@/pages/AboutPage";
import MenuPage from "@/pages/MenuPage";
import WhatsOnPage from "@/pages/WhatsOnPage";
import ArticleDetailPage from "@/pages/ArticleDetailPage";
import FaqPage from "@/pages/FaqPage";
import TermsPage from "@/pages/TermsPage";
import PrivacyPage from "@/pages/PrivacyPage";
import ReservationPage from "@/pages/ReservationPage";
import { LanguageProvider } from "@/lib/language";

type AdminRole = "admin_main" | "admin_cikarang" | "admin_bintaro";

function ProtectedAdminRoute({
  component: Component,
  allowedRoles,
}: {
  component: React.ComponentType;
  allowedRoles?: AdminRole[];
}) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [recheckTrigger, setRecheckTrigger] = useState(0);

  useEffect(() => {
    const checkSession = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/auth/session", { credentials: "include" });
        if (response.ok) {
          const data = await response.json();
          const isAllowed =
            data.authenticated &&
            (allowedRoles ? allowedRoles.includes(data.role as AdminRole) : true);
          setIsAuthenticated(isAllowed);
        } else {
          setIsAuthenticated(false);
        }
      } catch {
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
  }, [allowedRoles, recheckTrigger]);

  const handleLogin = () => setRecheckTrigger((prev) => prev + 1);

  if (isLoading) return <div>Loading...</div>;
  if (!isAuthenticated) return <LoginAdmin onLogin={handleLogin} />;
  return <Component />;
}

function AdminRoute({ component: Component }: { component: React.ComponentType }) {
  return <ProtectedAdminRoute component={Component} />;
}

function MainAdminRoute({ component: Component }: { component: React.ComponentType }) {
  return <ProtectedAdminRoute component={Component} allowedRoles={["admin_main"]} />;
}

function ArticleRoute() {
  const [, params] = useRoute("/whats-on/:id");
  return <ArticleDetailPage articleId={params?.id ?? ""} />;
}

function Router() {
  const [location] = useLocation();

  useEffect(() => {
    trackPageView({ path: location, title: document.title });
  }, [location]);

  return (
    <Switch>
      <Route path="/" component={WelcomePage} />
      <Route path="/about" component={AboutPage} />
      <Route path="/menu" component={MenuPage} />
      <Route path="/catering" component={CateringPage} />
      <Route path="/reservasi" component={ReservationPage} />
      <Route path="/whats-on" component={WhatsOnPage} />
      <Route path="/whats-on/:id" component={ArticleRoute} />
      <Route path="/faq" component={FaqPage} />
      <Route path="/terms" component={TermsPage} />
      <Route path="/privacy" component={PrivacyPage} />
      <Route path="/uni" component={UniPage} />
      <Route path="/services/outlet" component={OutletPage} />
      <Route path="/services/delivery" component={DeliveryPage} />
      <Route path="/services/partnership" component={PartnershipPage} />
      <Route path="/services/catering" component={CateringPage} />
      <Route path="/admin" component={() => <AdminRoute component={AdminDashboard} />} />
      <Route
        path="/admin/reservations"
        component={() => <AdminRoute component={AdminReservations} />}
      />
      <Route
        path="/admin/campaigns"
        component={() => <MainAdminRoute component={AdminCampaigns} />}
      />
      <Route path="/admin/users" component={() => <MainAdminRoute component={AdminUsers} />} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  useEffect(() => {
    initializeAnalytics();
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }
    return () => {
      if ("scrollRestoration" in history) {
        history.scrollRestoration = "auto";
      }
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <HelmetProvider>
          <LanguageProvider>
            <ScrollToTop />
            <Toaster />
            <Router />
          </LanguageProvider>
        </HelmetProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
