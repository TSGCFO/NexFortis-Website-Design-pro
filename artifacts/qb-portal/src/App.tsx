import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HelmetProvider } from "react-helmet-async";
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
import Order from "@/pages/order";
import Login from "@/pages/login";
import Register from "@/pages/register";
import Portal from "@/pages/portal";
import ForgotPassword from "@/pages/forgot-password";
import ResetPassword from "@/pages/reset-password";
import AuthCallback from "@/pages/auth-callback";
import Subscription from "@/pages/subscription";
import ServiceDetail from "@/pages/service-detail";
import Category from "@/pages/category";
import OrderDetail from "@/pages/order-detail";
import NotFound from "@/pages/not-found";
import MFAEnroll from "@/pages/admin/mfa-enroll";
import MFAChallenge from "@/pages/admin/mfa-challenge";
import AdminDashboard from "@/pages/admin/dashboard";
import AdminOrders from "@/pages/admin/orders";
import AdminOrderDetail from "@/pages/admin/order-detail";
import AdminCustomers from "@/pages/admin/customers";
import AdminTickets from "@/pages/admin/tickets";
import AdminTicketDetail from "@/pages/admin/ticket-detail";
import TicketDetail from "@/pages/ticket-detail";
import LandingPage from "@/pages/landing";
import { Helmet } from "react-helmet-async";
import {
  organizationSchema,
  websiteSchema,
  localBusinessSchema,
} from "@/lib/seo-schemas";

const queryClient = new QueryClient();

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
    </Layout>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/admin/mfa-enroll" component={MFAEnroll} />
      <Route path="/admin/mfa-challenge" component={MFAChallenge} />
      <Route path="/admin/orders/:id" component={AdminOrderDetail} />
      <Route path="/admin/orders" component={AdminOrders} />
      <Route path="/admin/customers" component={AdminCustomers} />
      <Route path="/admin/tickets/:id" component={AdminTicketDetail} />
      <Route path="/admin/tickets" component={AdminTickets} />
      <Route path="/admin" component={AdminDashboard} />
      <Route><CustomerRoutes /></Route>
    </Switch>
  );
}

function App() {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <ThemeProvider>
            <AuthProvider>
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
