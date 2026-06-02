import { Switch, Route, useLocation, useRoute } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { HelmetProvider } from "react-helmet-async";
import { initializeAnalytics, trackPageView } from "@/lib/analytics";
import { Suspense, lazy, useEffect, useState, type ComponentType } from "react";
import WelcomePage from "@/components/WelcomePage";
import RouteFallback from "@/components/RouteFallback";
import ScrollToTop from "@/components/ScrollToTop";
import LoginAdmin from "@/components/LoginAdmin";
import { LanguageProvider } from "@/lib/language";

const AboutPage = lazy(() => import("@/pages/AboutPage"));
const MenuPage = lazy(() => import("@/pages/MenuPage"));
const WhatsOnPage = lazy(() => import("@/pages/WhatsOnPage"));
const ArticleDetailPage = lazy(() => import("@/pages/ArticleDetailPage"));
const FaqPage = lazy(() => import("@/pages/FaqPage"));
const TermsPage = lazy(() => import("@/pages/TermsPage"));
const PrivacyPage = lazy(() => import("@/pages/PrivacyPage"));
const ReservationPage = lazy(() => import("@/pages/ReservationPage"));
const UniPage = lazy(() => import("@/components/UniPage"));
const OutletPage = lazy(() => import("@/components/services/OutletPage"));
const DeliveryPage = lazy(() => import("@/components/services/DeliveryPage"));
const PartnershipPage = lazy(() => import("@/components/services/PartnershipPage"));
const CateringPage = lazy(() => import("@/components/services/CateringPage"));
const AdminDashboard = lazy(() => import("@/pages/AdminDashboard"));
const AdminCampaigns = lazy(() => import("@/pages/AdminCampaigns"));
const AdminUsers = lazy(() => import("@/pages/AdminUsers"));
const AdminReservations = lazy(() => import("@/pages/AdminReservations"));
const NotFound = lazy(() => import("@/pages/not-found"));

type AdminRole = "admin_main" | "admin_cikarang" | "admin_bintaro";

function withSuspense(Component: ComponentType) {
  return function SuspendedRoute() {
    return (
      <Suspense fallback={<RouteFallback />}>
        <Component />
      </Suspense>
    );
  };
}

function ProtectedAdminRoute({
  component: Component,
  allowedRoles,
}: {
  component: ComponentType;
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

  if (isLoading) return <RouteFallback />;
  if (!isAuthenticated) return <LoginAdmin onLogin={handleLogin} />;
  return (
    <Suspense fallback={<RouteFallback />}>
      <Component />
    </Suspense>
  );
}

function AdminRoute({ component: Component }: { component: ComponentType }) {
  return <ProtectedAdminRoute component={Component} />;
}

function MainAdminRoute({ component: Component }: { component: ComponentType }) {
  return <ProtectedAdminRoute component={Component} allowedRoles={["admin_main"]} />;
}

function ArticleRoute() {
  const [, params] = useRoute("/whats-on/:id");
  return (
    <Suspense fallback={<RouteFallback />}>
      <ArticleDetailPage articleId={params?.id ?? ""} />
    </Suspense>
  );
}

function Router() {
  const [location] = useLocation();

  useEffect(() => {
    trackPageView({ path: location, title: document.title });
  }, [location]);

  return (
    <Switch>
      <Route path="/" component={WelcomePage} />
      <Route path="/about" component={withSuspense(AboutPage)} />
      <Route path="/menu" component={withSuspense(MenuPage)} />
      <Route path="/catering" component={withSuspense(CateringPage)} />
      <Route path="/reservasi" component={withSuspense(ReservationPage)} />
      <Route path="/whats-on" component={withSuspense(WhatsOnPage)} />
      <Route path="/whats-on/:id" component={ArticleRoute} />
      <Route path="/faq" component={withSuspense(FaqPage)} />
      <Route path="/terms" component={withSuspense(TermsPage)} />
      <Route path="/privacy" component={withSuspense(PrivacyPage)} />
      <Route path="/uni" component={withSuspense(UniPage)} />
      <Route path="/services/outlet" component={withSuspense(OutletPage)} />
      <Route path="/services/delivery" component={withSuspense(DeliveryPage)} />
      <Route path="/services/partnership" component={withSuspense(PartnershipPage)} />
      <Route path="/services/catering" component={withSuspense(CateringPage)} />
      <Route
        path="/admin"
        component={() => <AdminRoute component={AdminDashboard} />}
      />
      <Route
        path="/admin/reservations"
        component={() => <AdminRoute component={AdminReservations} />}
      />
      <Route
        path="/admin/campaigns"
        component={() => <MainAdminRoute component={AdminCampaigns} />}
      />
      <Route
        path="/admin/users"
        component={() => <MainAdminRoute component={AdminUsers} />}
      />
      <Route component={withSuspense(NotFound)} />
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
