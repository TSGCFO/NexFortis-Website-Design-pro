import { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MotionConfig } from "framer-motion";
import { HelmetProvider } from "react-helmet-async";
import { SeoHeadDedupe } from "@/components/seo-head-dedupe";

const queryClient = new QueryClient();

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <HelmetProvider>
      <SeoHeadDedupe />
      <QueryClientProvider client={queryClient}>
        <MotionConfig reducedMotion="user">
          {children}
        </MotionConfig>
      </QueryClientProvider>
    </HelmetProvider>
  );
}
