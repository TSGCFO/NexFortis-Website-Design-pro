import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/lib/auth";
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
import ServiceDetail from "@/pages/service-detail";
import Category from "@/pages/category";
import OrderDetail from "@/pages/order-detail";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient();

function Router() {
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
        <Route path="/service/:slug" component={ServiceDetail} />
        <Route path="/category/:slug" component={Category} />
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
        <Route path="/forgot-password" component={ForgotPassword} />
        <Route path="/reset-password" component={ResetPassword} />
        <Route path="/portal" component={Portal} />
        <Route path="/order/:id" component={OrderDetail} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Router />
          </WouterRouter>
          <Toaster />
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
