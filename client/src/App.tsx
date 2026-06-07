import { Switch, Route, useLocation, useRoute } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { HelmetProvider } from "react-helmet-async";
import { initializeAnalytics, trackPageView } from "@/lib/analytics";
import { Suspense, lazy, useEffect, type ComponentType } from "react";
import WelcomePage from "@/components/WelcomePage";
import RouteFallback from "@/components/RouteFallback";
import ScrollToTop from "@/components/ScrollToTop";
import { LanguageProvider } from "@/lib/language";
import {
  BintaroAdminDashboard,
  BintaroAdminReservations,
  CikarangAdminDashboard,
  CikarangAdminReservations,
  MainAdminDashboard,
  MainAdminOnlyPage,
  MainAdminReservations,
} from "@/components/admin/adminRoutes";

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
const AdminCampaigns = lazy(() => import("@/pages/AdminCampaigns"));
const AdminUsers = lazy(() => import("@/pages/AdminUsers"));
const AdminEmails = lazy(() => import("@/pages/AdminEmails"));
const NotFound = lazy(() => import("@/pages/not-found"));

function withSuspense(Component: ComponentType) {
  return function SuspendedRoute() {
    return (
      <Suspense fallback={<RouteFallback />}>
        <Component />
      </Suspense>
    );
  };
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
      <Route path="/admin/cikarang/reservations" component={CikarangAdminReservations} />
      <Route path="/admin/cikarang" component={CikarangAdminDashboard} />
      <Route path="/admin/bintaro/reservations" component={BintaroAdminReservations} />
      <Route path="/admin/bintaro" component={BintaroAdminDashboard} />
      <Route path="/admin/reservations" component={MainAdminReservations} />
      <Route
        path="/admin/campaigns"
        component={() => <MainAdminOnlyPage component={AdminCampaigns} />}
      />
      <Route
        path="/admin/users"
        component={() => <MainAdminOnlyPage component={AdminUsers} />}
      />
      <Route
        path="/admin/emails"
        component={() => <MainAdminOnlyPage component={AdminEmails} />}
      />
      <Route path="/admin" component={MainAdminDashboard} />
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
