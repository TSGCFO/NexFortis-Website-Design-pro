import { Switch, Route, Router as WouterRouter, Redirect } from "wouter";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Layout, FloatingCTA, BackToTop } from "@/components/layout";
import { CookieConsent } from "@/components/cookie-consent";
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
const DmSeo = lazy(() => import("@/pages/services/digital-marketing/seo"));
const DmLocalSeo = lazy(() => import("@/pages/services/digital-marketing/local-seo"));
const DmGeo = lazy(() => import("@/pages/services/digital-marketing/generative-engine-optimization"));
const DmTechnicalSeo = lazy(() => import("@/pages/services/digital-marketing/technical-seo"));
const DmGbp = lazy(() => import("@/pages/services/digital-marketing/google-business-profile"));
const DmContentMarketing = lazy(() => import("@/pages/services/digital-marketing/content-marketing"));
const DmLinkBuilding = lazy(() => import("@/pages/services/digital-marketing/link-building"));
const DmGoogleAds = lazy(() => import("@/pages/services/digital-marketing/google-ads"));
const DmSocialMedia = lazy(() => import("@/pages/services/digital-marketing/social-media-marketing"));
const DmWebDesign = lazy(() => import("@/pages/services/digital-marketing/web-design"));
const DmEmailMarketing = lazy(() => import("@/pages/services/digital-marketing/email-marketing"));
const DmCro = lazy(() => import("@/pages/services/digital-marketing/conversion-rate-optimization"));
const DmAnalytics = lazy(() => import("@/pages/services/digital-marketing/analytics-reporting"));
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
          <Route path="/services/digital-marketing/seo" component={DmSeo} />
          <Route path="/services/digital-marketing/local-seo" component={DmLocalSeo} />
          <Route path="/services/digital-marketing/generative-engine-optimization" component={DmGeo} />
          <Route path="/services/digital-marketing/technical-seo" component={DmTechnicalSeo} />
          <Route path="/services/digital-marketing/google-business-profile" component={DmGbp} />
          <Route path="/services/digital-marketing/content-marketing" component={DmContentMarketing} />
          <Route path="/services/digital-marketing/link-building" component={DmLinkBuilding} />
          <Route path="/services/digital-marketing/google-ads" component={DmGoogleAds} />
          <Route path="/services/digital-marketing/social-media-marketing" component={DmSocialMedia} />
          <Route path="/services/digital-marketing/web-design" component={DmWebDesign} />
          <Route path="/services/digital-marketing/email-marketing" component={DmEmailMarketing} />
          <Route path="/services/digital-marketing/conversion-rate-optimization" component={DmCro} />
          <Route path="/services/digital-marketing/analytics-reporting" component={DmAnalytics} />
          <Route path="/services/microsoft-365" component={Microsoft365} />
          <Route path="/services/quickbooks" component={QuickBooks} />
          <Route path="/services/it-consulting" component={ITConsulting} />
          <Route path="/services/workflow-automation" component={AutomationSoftware} />
          <Route path="/services/automation-software">
            <Redirect to="/services/workflow-automation" replace />
          </Route>
          <Route path="/contact" component={Contact} />
          <Route path="/blog" component={Blog} />
          <Route path="/admin/login" component={AdminLogin} />
          <Route path="/blog/admin" component={BlogAdmin} />
          <Route path="/blog/:slug">
            {(params) => <BlogPostPage slug={params.slug} />}
          </Route>
          <Route path="/privacy" component={Privacy} />
          <Route path="/terms" component={Terms} />
          {/* 404 catch-all. DO NOT add a path prop to this Route.
              The prerender script discovers static routes by matching Route path
              string literals in this file; a wildcard path prop here would be
              picked up as a route to prerender and either fail with a cryptic
              puppeteer error or emit a NotFound index.html at an invalid path
              on disk. A catch-all Route without a path prop is the correct
              wouter idiom for a 404 and is invisible to the discovery regex. */}
          <Route component={NotFound} />
        </Switch>
      </Suspense>
      <FloatingCTA />
      <BackToTop />
      <CookieConsent />
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
