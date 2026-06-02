import { Switch, Route, useLocation, useRoute } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { HelmetProvider } from "react-helmet-async";
import { initializeAnalytics, trackPageView } from "@/lib/analytics";
import { Suspense, lazy, useEffect, useState } from "react";
import WelcomePage from "@/components/WelcomePage";
import ScrollToTop from "@/components/ScrollToTop";
import RouteFallback from "@/components/RouteFallback";
import AppErrorBoundary from "@/components/AppErrorBoundary";
import LoginAdmin from "@/components/LoginAdmin";
import { LanguageProvider } from "@/lib/language";
import { lazyRetry } from "@/lib/lazyRetry";

const Toaster = lazy(() =>
  import("@/components/ui/toaster").then((m) => ({ default: m.Toaster })),
);

const UniPage = lazyRetry(() => import("@/components/UniPage"));
const OutletPage = lazyRetry(() => import("@/components/services/OutletPage"));
const DeliveryPage = lazyRetry(() => import("@/components/services/DeliveryPage"));
const PartnershipPage = lazyRetry(() => import("@/components/services/PartnershipPage"));
const CateringPage = lazyRetry(() => import("@/components/services/CateringPage"));
const AdminDashboard = lazyRetry(() => import("@/pages/AdminDashboard"));
const AdminCampaigns = lazyRetry(() => import("@/pages/AdminCampaigns"));
const AdminUsers = lazyRetry(() => import("@/pages/AdminUsers"));
const AdminReservations = lazyRetry(() => import("@/pages/AdminReservations"));
const NotFound = lazyRetry(() => import("@/pages/not-found"));
const AboutPage = lazyRetry(() => import("@/pages/AboutPage"));
const MenuPage = lazyRetry(() => import("@/pages/MenuPage"));
const WhatsOnPage = lazyRetry(() => import("@/pages/WhatsOnPage"));
const ArticleDetailPage = lazyRetry(() => import("@/pages/ArticleDetailPage"));
const FaqPage = lazyRetry(() => import("@/pages/FaqPage"));
const TermsPage = lazyRetry(() => import("@/pages/TermsPage"));
const PrivacyPage = lazyRetry(() => import("@/pages/PrivacyPage"));
const ReservationPage = lazyRetry(() => import("@/pages/ReservationPage"));

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

  if (isLoading) return <RouteFallback />;
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
  return (
    <Suspense fallback={<RouteFallback />}>
      <ArticleDetailPage articleId={params?.id ?? ""} />
    </Suspense>
  );
}

function LazyRoute({ component: Component }: { component: React.ComponentType }) {
  return (
    <Suspense fallback={<RouteFallback />}>
      <Component />
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
      <Route path="/about" component={() => <LazyRoute component={AboutPage} />} />
      <Route path="/menu" component={() => <LazyRoute component={MenuPage} />} />
      <Route path="/catering" component={() => <LazyRoute component={CateringPage} />} />
      <Route path="/reservasi" component={() => <LazyRoute component={ReservationPage} />} />
      <Route path="/whats-on" component={() => <LazyRoute component={WhatsOnPage} />} />
      <Route path="/whats-on/:id" component={ArticleRoute} />
      <Route path="/faq" component={() => <LazyRoute component={FaqPage} />} />
      <Route path="/terms" component={() => <LazyRoute component={TermsPage} />} />
      <Route path="/privacy" component={() => <LazyRoute component={PrivacyPage} />} />
      <Route path="/uni" component={() => <LazyRoute component={UniPage} />} />
      <Route path="/services/outlet" component={() => <LazyRoute component={OutletPage} />} />
      <Route path="/services/delivery" component={() => <LazyRoute component={DeliveryPage} />} />
      <Route path="/services/partnership" component={() => <LazyRoute component={PartnershipPage} />} />
      <Route path="/services/catering" component={() => <LazyRoute component={CateringPage} />} />
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
      <Route component={() => <LazyRoute component={NotFound} />} />
    </Switch>
  );
}

function App() {
  const [showToaster, setShowToaster] = useState(false);

  useEffect(() => {
    const t = window.setTimeout(() => setShowToaster(true), 0);
    return () => window.clearTimeout(t);
  }, []);

  useEffect(() => {
    const scheduleAnalytics = () => {
      initializeAnalytics();
    };
    if (typeof window.requestIdleCallback === "function") {
      const id = window.requestIdleCallback(scheduleAnalytics, { timeout: 3000 });
      return () => window.cancelIdleCallback(id);
    }
    const t = window.setTimeout(scheduleAnalytics, 1500);
    return () => window.clearTimeout(t);
  }, []);

  useEffect(() => {
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
            <AppErrorBoundary>
              <ScrollToTop />
              {showToaster && (
                <Suspense fallback={null}>
                  <Toaster />
                </Suspense>
              )}
              <Router />
            </AppErrorBoundary>
          </LanguageProvider>
        </HelmetProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
