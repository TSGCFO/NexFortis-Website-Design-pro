import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HelmetProvider } from "react-helmet-async";
import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/lib/auth";
import { ThemeProvider } from "@/hooks/use-theme";
import { Layout } from "@/components/layout";
import Home from "@/pages/home";
import Catalog from "@/pages/catalog";
import FAQ from "@/pages/faq";
import QBMGuide from "@/pages/qbm-guide";
import Terms from "@/pages/terms";
import Privacy from "@/pages/privacy";
import Waitlist from "@/pages/waitlist";
import ServiceDetail from "@/pages/service-detail";
import Category from "@/pages/category";
import LandingPage from "@/pages/landing";
import NotFound from "@/pages/not-found";
import { Helmet } from "react-helmet-async";
import {
  organizationSchema,
  websiteSchema,
  localBusinessSchema,
} from "@/lib/seo-schemas";

// Lazy-loaded routes — auth, customer portal, and admin code is split out so
// public/SEO-facing pages (home, catalog, FAQ, service pages) ship the smallest
// possible JavaScript bundle to improve LCP / Core Web Vitals scores.
const Order = lazy(() => import("@/pages/order"));
const Login = lazy(() => import("@/pages/login"));
const Register = lazy(() => import("@/pages/register"));
const Portal = lazy(() => import("@/pages/portal"));
const ForgotPassword = lazy(() => import("@/pages/forgot-password"));
const ResetPassword = lazy(() => import("@/pages/reset-password"));
const AuthCallback = lazy(() => import("@/pages/auth-callback"));
const Subscription = lazy(() => import("@/pages/subscription"));
const OrderDetail = lazy(() => import("@/pages/order-detail"));
const TicketDetail = lazy(() => import("@/pages/ticket-detail"));
const MFAEnroll = lazy(() => import("@/pages/admin/mfa-enroll"));
const MFAChallenge = lazy(() => import("@/pages/admin/mfa-challenge"));
const AdminDashboard = lazy(() => import("@/pages/admin/dashboard"));
const AdminOrders = lazy(() => import("@/pages/admin/orders"));
const AdminOrderDetail = lazy(() => import("@/pages/admin/order-detail"));
const AdminCustomers = lazy(() => import("@/pages/admin/customers"));
const AdminPromoCodes = lazy(() => import("@/pages/admin/promo-codes"));
const AdminPromoCodeNew = lazy(() => import("@/pages/admin/promo-code-new"));
const AdminPromoCodeDetail = lazy(() => import("@/pages/admin/promo-code-detail"));
const AdminTickets = lazy(() => import("@/pages/admin/tickets"));
const AdminTicketDetail = lazy(() => import("@/pages/admin/ticket-detail"));

const queryClient = new QueryClient();

function PageFallback() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

function GlobalSchemas() {
  const schemas = [organizationSchema(), websiteSchema(), localBusinessSchema()];
  return (
    <Helmet>
      {schemas.map((s, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(s)}
        </script>
      ))}
    </Helmet>
  );
}

function CustomerRoutes() {
  return (
    <Layout>
      <Suspense fallback={<PageFallback />}>
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/catalog" component={Catalog} />
          <Route path="/faq" component={FAQ} />
          <Route path="/qbm-guide" component={QBMGuide} />
          <Route path="/terms" component={Terms} />
          <Route path="/privacy" component={Privacy} />
          <Route path="/waitlist" component={Waitlist} />
          <Route path="/order" component={Order} />
          <Route path="/subscription" component={Subscription} />
          <Route path="/service/:slug" component={ServiceDetail} />
          <Route path="/category/:slug" component={Category} />
          <Route path="/login" component={Login} />
          <Route path="/register" component={Register} />
          <Route path="/forgot-password" component={ForgotPassword} />
          <Route path="/reset-password" component={ResetPassword} />
          <Route path="/auth/callback" component={AuthCallback} />
          <Route path="/portal" component={Portal} />
          <Route path="/ticket/:id" component={TicketDetail} />
          <Route path="/order/:id" component={OrderDetail} />
          <Route path="/landing/:slug" component={LandingPage} />
          <Route component={NotFound} />
        </Switch>
      </Suspense>
    </Layout>
  );
}

function Router() {
  return (
    <Suspense fallback={<PageFallback />}>
      <Switch>
        <Route path="/admin/mfa-enroll" component={MFAEnroll} />
        <Route path="/admin/mfa-challenge" component={MFAChallenge} />
        <Route path="/admin/orders/:id" component={AdminOrderDetail} />
        <Route path="/admin/orders" component={AdminOrders} />
        <Route path="/admin/customers" component={AdminCustomers} />
        <Route path="/admin/promo-codes/new" component={AdminPromoCodeNew} />
        <Route path="/admin/promo-codes/:id" component={AdminPromoCodeDetail} />
        <Route path="/admin/promo-codes" component={AdminPromoCodes} />
        <Route path="/admin/tickets/:id" component={AdminTicketDetail} />
        <Route path="/admin/tickets" component={AdminTickets} />
        <Route path="/admin" component={AdminDashboard} />
        <Route><CustomerRoutes /></Route>
      </Switch>
    </Suspense>
  );
}

function App() {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <ThemeProvider>
            <AuthProvider>
              {/* Global JSON-LD schemas — Organization, WebSite, LocalBusiness. Landing pages add their own Service/FAQ/Breadcrumb schemas. Do NOT duplicate global schemas in individual pages. */}
              <GlobalSchemas />
              <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
                <Router />
              </WouterRouter>
              <Toaster />
            </AuthProvider>
          </ThemeProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
}

export default App;
