import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MotionConfig } from "framer-motion";
import { HelmetProvider } from "react-helmet-async";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Layout, FloatingCTA } from "@/components/layout";
import { ThemeProvider } from "@/hooks/use-theme";

// Pages
import Home from "@/pages/home";
import About from "@/pages/about";
import ServicesOverview from "@/pages/services";
import DigitalMarketing from "@/pages/services/digital-marketing";
import Microsoft365 from "@/pages/services/microsoft-365";
import QuickBooks from "@/pages/services/quickbooks";
import ITConsulting from "@/pages/services/it-consulting";
import AutomationSoftware from "@/pages/services/automation";
import Contact from "@/pages/contact";
import Blog from "@/pages/blog";
import BlogPostPage from "@/pages/blog-post";
import BlogAdmin from "@/pages/blog-admin";
import Placeholder from "@/pages/placeholder";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient();

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/about" component={About} />
        <Route path="/services" component={ServicesOverview} />
        <Route path="/services/digital-marketing" component={DigitalMarketing} />
        <Route path="/services/microsoft-365" component={Microsoft365} />
        <Route path="/services/quickbooks" component={QuickBooks} />
        <Route path="/services/it-consulting" component={ITConsulting} />
        <Route path="/services/automation-software" component={AutomationSoftware} />
        <Route path="/contact" component={Contact} />
        <Route path="/blog" component={Blog} />
        <Route path="/blog/admin" component={BlogAdmin} />
        <Route path="/blog/:slug">
          {(params) => <BlogPostPage slug={params.slug} />}
        </Route>
        <Route path="/privacy">
          {() => <Placeholder title="Privacy Policy" />}
        </Route>
        <Route path="/terms">
          {() => <Placeholder title="Terms of Service" />}
        </Route>
        <Route component={NotFound} />
      </Switch>
      <FloatingCTA />
    </Layout>
  );
}

function App() {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <MotionConfig reducedMotion="user">
            <TooltipProvider>
              <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
                <Router />
              </WouterRouter>
              <Toaster />
            </TooltipProvider>
          </MotionConfig>
        </ThemeProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
}

export default App;
