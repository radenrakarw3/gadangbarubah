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
import { AdminAuthProvider } from "@/lib/admin-auth";
import {
  BintaroAdminDashboard,
  BintaroReservationStaff,
  CikarangAdminDashboard,
  CikarangReservationStaff,
  MainAdminDashboard,
  MainAdminOnlyPage,
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
const KemitraanPage = lazy(() => import("@/pages/KemitraanPage"));
const OutletPage = lazy(() => import("@/components/services/OutletPage"));
const DeliveryPage = lazy(() => import("@/components/services/DeliveryPage"));
const CateringPage = lazy(() => import("@/components/services/CateringPage"));
const AdminCampaigns = lazy(() => import("@/pages/AdminCampaigns"));
const AdminUsers = lazy(() => import("@/pages/AdminUsers"));
const AdminEmails = lazy(() => import("@/pages/AdminEmails"));
const AdminMenu = lazy(() => import("@/pages/AdminMenu"));
const AdminWhatsOn = lazy(() => import("@/pages/AdminWhatsOn"));
const AdminLoginPage = lazy(() => import("@/pages/AdminLoginPage"));
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

function AdminRedirect({ to }: { to: string }) {
  const [, navigate] = useLocation();
  useEffect(() => {
    navigate(to, { replace: true });
  }, [navigate, to]);
  return <RouteFallback />;
}

function ArticleRoute() {
  const [, params] = useRoute("/whats-on/:slug");
  const slug = params?.slug ? decodeURIComponent(params.slug) : "";
  return (
    <Suspense fallback={<RouteFallback />}>
      <ArticleDetailPage articleSlug={slug} />
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
      <Route path="/whats-on/:slug" component={ArticleRoute} />
      <Route path="/faq" component={withSuspense(FaqPage)} />
      <Route path="/terms" component={withSuspense(TermsPage)} />
      <Route path="/privacy" component={withSuspense(PrivacyPage)} />
      <Route path="/kemitraan" component={withSuspense(KemitraanPage)} />
      <Route path="/uni" component={withSuspense(UniPage)} />
      <Route path="/services/outlet" component={withSuspense(OutletPage)} />
      <Route path="/services/delivery" component={withSuspense(DeliveryPage)} />
      <Route path="/services/partnership">
        <AdminRedirect to="/kemitraan" />
      </Route>
      <Route path="/services/catering" component={withSuspense(CateringPage)} />
      <Route path="/admin/login" component={withSuspense(AdminLoginPage)} />
      <Route path="/kelola-reservasi/cikarang/dashboard" component={CikarangAdminDashboard} />
      <Route path="/kelola-reservasi/bintaro/dashboard" component={BintaroAdminDashboard} />
      <Route path="/kelola-reservasi/cikarang" component={CikarangReservationStaff} />
      <Route path="/kelola-reservasi/bintaro" component={BintaroReservationStaff} />
      <Route path="/admin/cikarang/reservations">
        <AdminRedirect to="/kelola-reservasi/cikarang" />
      </Route>
      <Route path="/admin/cikarang">
        <AdminRedirect to="/kelola-reservasi/cikarang" />
      </Route>
      <Route path="/admin/bintaro/reservations">
        <AdminRedirect to="/kelola-reservasi/bintaro" />
      </Route>
      <Route path="/admin/bintaro">
        <AdminRedirect to="/kelola-reservasi/bintaro" />
      </Route>
      <Route path="/admin/reservations">
        <AdminRedirect to="/admin" />
      </Route>
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
      <Route
        path="/admin/menu"
        component={() => <MainAdminOnlyPage component={AdminMenu} />}
      />
      <Route
        path="/admin/whats-on"
        component={() => <MainAdminOnlyPage component={AdminWhatsOn} />}
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
            <AdminAuthProvider>
              <ScrollToTop />
              <Toaster />
              <Router />
            </AdminAuthProvider>
          </LanguageProvider>
        </HelmetProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
