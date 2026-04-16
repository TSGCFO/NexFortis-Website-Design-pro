import { Switch, Route, Router as WouterRouter } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Layout, FloatingCTA, BackToTop } from "@/components/layout";
import { ThemeProvider } from "@/hooks/use-theme";
import { lazy, Suspense } from "react";

const Home = lazy(() => import("@/pages/home"));
const About = lazy(() => import("@/pages/about"));
const ServicesOverview = lazy(() => import("@/pages/services"));
const DigitalMarketing = lazy(() => import("@/pages/services/digital-marketing"));
const Microsoft365 = lazy(() => import("@/pages/services/microsoft-365"));
const QuickBooks = lazy(() => import("@/pages/services/quickbooks"));
const ITConsulting = lazy(() => import("@/pages/services/it-consulting"));
const AutomationSoftware = lazy(() => import("@/pages/services/automation"));
const Contact = lazy(() => import("@/pages/contact"));
const Blog = lazy(() => import("@/pages/blog"));
const BlogPostPage = lazy(() => import("@/pages/blog-post"));
const BlogAdmin = lazy(() => import("@/pages/blog-admin"));
const AdminLogin = lazy(() => import("@/pages/admin-login"));
const Privacy = lazy(() => import("@/pages/privacy"));
const Terms = lazy(() => import("@/pages/terms"));
const NotFound = lazy(() => import("@/pages/not-found"));

const LazyProviders = lazy(() => import("@/components/providers"));

function PageFallback() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

function Router() {
  return (
    <Layout>
      <Suspense fallback={<PageFallback />}>
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
          <Route path="/admin/login" component={AdminLogin} />
          <Route path="/blog/admin" component={BlogAdmin} />
          <Route path="/blog/:slug">
            {(params) => <BlogPostPage slug={params.slug} />}
          </Route>
          <Route path="/privacy" component={Privacy} />
          <Route path="/terms" component={Terms} />
          <Route component={NotFound} />
        </Switch>
      </Suspense>
      <FloatingCTA />
      <BackToTop />
    </Layout>
  );
}

function App() {
  return (
    <Suspense fallback={<PageFallback />}>
      <LazyProviders>
        <ThemeProvider>
          <TooltipProvider>
            <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
              <Router />
            </WouterRouter>
            <Toaster />
          </TooltipProvider>
        </ThemeProvider>
      </LazyProviders>
    </Suspense>
  );
}

export default App;
