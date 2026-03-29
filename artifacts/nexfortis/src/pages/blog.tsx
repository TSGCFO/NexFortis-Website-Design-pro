import { PageHero, Section } from "@/components/ui-elements";
import { SEO, BreadcrumbSchema } from "@/components/seo";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import { motion } from "framer-motion";

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  coverImage: string | null;
  published: boolean;
  createdAt: string;
  readTime?: number;
}

const BASE = import.meta.env.BASE_URL;

const fallbackPosts: BlogPost[] = [
  {
    id: 1,
    title: "Migrating to Microsoft 365: A Step-by-Step Guide for Canadian Small Businesses",
    slug: "migrating-to-microsoft-365",
    excerpt: "Moving from legacy email and shared drives to Microsoft 365 is one of the highest-ROI technology investments a small business can make. Learn the key steps, common pitfalls, and what to expect from a zero-downtime migration.",
    category: "Microsoft 365",
    coverImage: `${BASE}images/blog-1.png`,
    published: true,
    createdAt: "2024-03-12T00:00:00Z",
    readTime: 7,
  },
  {
    id: 2,
    title: "Why Your Business Needs an IT Audit Before Year End",
    slug: "tech-audit-before-year-end",
    excerpt: "Uncovering hidden licensing costs and patching security vulnerabilities should be a priority before finalizing your annual budget. Here's what a thorough IT audit covers and how it saves Canadian SMBs thousands each year.",
    category: "IT Consulting",
    coverImage: `${BASE}images/blog-2.png`,
    published: true,
    createdAt: "2024-02-28T00:00:00Z",
    readTime: 5,
  },
  {
    id: 3,
    title: "The Power of Zapier: 5 Workflows Canadian Businesses Can Automate Today",
    slug: "zapier-5-workflows",
    excerpt: "Stop copying and pasting data between systems. These five simple Zapier automations can save your team hours every week — no coding required. Real examples from accounting, CRM, and project management tools.",
    category: "Automation",
    coverImage: `${BASE}images/blog-3.png`,
    published: true,
    createdAt: "2024-02-15T00:00:00Z",
    readTime: 6,
  },
  {
    id: 4,
    title: "QuickBooks Data Migration: What to Expect and How to Prepare",
    slug: "quickbooks-data-migration-guide",
    excerpt: "Switching from Sage 50, SAP, or Xero to QuickBooks? This guide walks you through exactly how data migration works, what gets transferred, and how to ensure a clean, accurate transition with zero loss.",
    category: "QuickBooks",
    coverImage: `${BASE}images/blog-1.png`,
    published: true,
    createdAt: "2024-01-20T00:00:00Z",
    readTime: 8,
  },
  {
    id: 5,
    title: "Google Ads vs. SEO: Which Should Canadian Businesses Invest In First?",
    slug: "google-ads-vs-seo-canada",
    excerpt: "Both Google Ads and SEO drive traffic, but they work differently and suit different stages of business growth. Here's a practical breakdown to help you decide where to put your digital marketing budget first.",
    category: "Digital Marketing",
    coverImage: `${BASE}images/blog-2.png`,
    published: true,
    createdAt: "2024-01-08T00:00:00Z",
    readTime: 6,
  },
  {
    id: 6,
    title: "Understanding Zero Trust Security for Small Business",
    slug: "zero-trust-security-small-business",
    excerpt: "Zero trust isn't just an enterprise buzzword — it's an approachable security framework that any Canadian business can adopt. Learn what zero trust means in practice and how Microsoft 365 makes it accessible.",
    category: "Cybersecurity",
    coverImage: `${BASE}images/blog-3.png`,
    published: true,
    createdAt: "2023-12-15T00:00:00Z",
    readTime: 5,
  },
];

function estimateReadTime(excerpt: string): number {
  const words = excerpt.split(/\s+/).length;
  return Math.max(3, Math.ceil((words * 10) / 200));
}

const categoryColors: Record<string, string> = {
  "Microsoft 365": "bg-blue-500",
  "IT Consulting": "bg-primary",
  "Automation": "bg-purple-500",
  "QuickBooks": "bg-green-600",
  "Digital Marketing": "bg-orange-500",
  "Cybersecurity": "bg-red-500",
};

export default function Blog() {
  const { data: posts = fallbackPosts } = useQuery<BlogPost[]>({
    queryKey: ["blog-posts"],
    queryFn: () => apiFetch<BlogPost[]>("/blog/posts"),
    retry: 1,
  });

  const [featured, ...rest] = posts;

  return (
    <div>
      <SEO
        title="Blog — Insights & IT Resources"
        description="Expert IT advice, managed services guides, QuickBooks tips, Microsoft 365 how-tos, and digital marketing insights from the NexFortis team in Canada."
        path="/blog"
        type="website"
      />
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://nexfortis.com/" },
          { name: "Blog", url: "https://nexfortis.com/blog" },
        ]}
      />
      <PageHero
        title="Insights & IT Resources"
        subtitle="Practical guides, industry news, and expert advice to help Canadian businesses get more from their technology."
      />

      <Section bg="white">
        {posts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-2xl font-display font-bold text-primary mb-4">No posts yet</p>
            <p className="text-muted-foreground">Check back soon for insights from the NexFortis team.</p>
          </div>
        ) : (
          <div className="space-y-16">
            {featured && (
              <motion.article
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
                className="group grid lg:grid-cols-2 gap-10 items-center bg-secondary rounded-3xl border border-border overflow-hidden hover:border-accent/40 hover:shadow-xl transition-all"
              >
                <div className="h-64 lg:h-full min-h-[280px] overflow-hidden relative bg-gradient-to-br from-accent/15 to-primary/15 flex items-center justify-center">
                  {featured.coverImage ? (
                    <img
                      src={featured.coverImage}
                      alt={`Cover image for ${featured.title}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                      width={600}
                      height={400}
                    />
                  ) : (
                    <span className="text-8xl font-display font-extrabold text-accent/15 select-none" aria-hidden="true">
                      {featured.title.charAt(0)}
                    </span>
                  )}
                  <div className={`absolute top-4 left-4 ${categoryColors[featured.category] ?? "bg-accent"} text-white text-xs font-bold px-3 py-1 rounded-full`}>
                    {featured.category}
                  </div>
                  <div className="absolute top-4 right-4 bg-warning text-warning-foreground text-xs font-bold px-3 py-1 rounded-full">
                    Featured
                  </div>
                </div>

                <div className="p-8 lg:py-12">
                  <div className="flex items-center gap-4 text-xs text-muted-foreground font-medium mb-4">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" aria-hidden="true" />
                      <time dateTime={featured.createdAt}>
                        {new Date(featured.createdAt).toLocaleDateString("en-CA", { year: "numeric", month: "long", day: "numeric" })}
                      </time>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" aria-hidden="true" />
                      {featured.readTime ?? estimateReadTime(featured.excerpt)} min read
                    </span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-display font-bold text-primary mb-4 group-hover:text-accent transition-colors leading-tight">
                    {featured.title}
                  </h2>
                  <p className="text-muted-foreground leading-relaxed mb-6">
                    {featured.excerpt}
                  </p>
                  <Link
                    href={`/blog/${featured.slug}`}
                    className="inline-flex items-center gap-2 text-accent font-semibold hover:underline"
                  >
                    Read Full Article <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </Link>
                </div>
              </motion.article>
            )}

            {rest.length > 0 && (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {rest.map((post, i) => (
                  <motion.article
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: i * 0.07 }}
                    className="bg-card rounded-2xl border border-border overflow-hidden hover:shadow-xl hover:border-accent/40 transition-all duration-200 flex flex-col group"
                  >
                    <div className="h-44 overflow-hidden relative bg-gradient-to-br from-accent/10 to-primary/10 flex items-center justify-center">
                      {post.coverImage ? (
                        <img
                          src={post.coverImage}
                          alt={`Cover image for ${post.title}`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                          width={400}
                          height={176}
                        />
                      ) : (
                        <span className="text-5xl font-display font-extrabold text-accent/15 select-none" aria-hidden="true">
                          {post.title.charAt(0)}
                        </span>
                      )}
                      <div className={`absolute top-3 left-3 ${categoryColors[post.category] ?? "bg-accent"} text-white text-xs font-bold px-2.5 py-1 rounded-full`}>
                        {post.category}
                      </div>
                    </div>

                    <div className="p-6 flex flex-col flex-grow">
                      <div className="flex items-center gap-4 text-xs text-muted-foreground font-medium mb-3">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-3 h-3" aria-hidden="true" />
                          <time dateTime={post.createdAt}>
                            {new Date(post.createdAt).toLocaleDateString("en-CA", { year: "numeric", month: "short", day: "numeric" })}
                          </time>
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-3 h-3" aria-hidden="true" />
                          {post.readTime ?? estimateReadTime(post.excerpt)} min read
                        </span>
                      </div>
                      <h2 className="text-lg font-bold text-primary mb-3 group-hover:text-accent transition-colors leading-snug">
                        {post.title}
                      </h2>
                      <p className="text-muted-foreground text-sm mb-6 flex-grow leading-relaxed line-clamp-3">
                        {post.excerpt}
                      </p>
                      <Link
                        href={`/blog/${post.slug}`}
                        className="text-accent font-semibold text-sm hover:underline mt-auto inline-flex items-center gap-1"
                      >
                        Read Article <ArrowRight className="w-4 h-4" aria-hidden="true" />
                      </Link>
                    </div>
                  </motion.article>
                ))}
              </div>
            )}
          </div>
        )}
      </Section>
    </div>
  );
}
