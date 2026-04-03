import { Section } from "@/components/ui-elements";
import { SEO, ArticleSchema, BreadcrumbSchema } from "@/components/seo";
import { Calendar, ArrowLeft, Tag } from "lucide-react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  coverImage: string | null;
  published: boolean;
  createdAt: string;
}

export default function BlogPostPage({ slug }: { slug: string }) {
  const { data: post, isLoading, error } = useQuery<BlogPost>({
    queryKey: ["blog-post", slug],
    queryFn: () => apiFetch<BlogPost>(`/blog/posts/${slug}`),
    retry: 1,
  });

  if (isLoading) {
    return (
      <Section bg="white">
        <div className="max-w-3xl mx-auto text-center py-20">
          <div className="w-8 h-8 border-3 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading article...</p>
        </div>
      </Section>
    );
  }

  if (error || !post) {
    return (
      <Section bg="white">
        <div className="max-w-3xl mx-auto text-center py-20">
          <h1 className="text-3xl font-display font-bold text-primary mb-4">Article Not Found</h1>
          <p className="text-muted-foreground mb-8">The article you're looking for doesn't exist or has been removed.</p>
          <Link href="/blog" className="text-accent font-semibold hover:underline inline-flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" /> Back to Blog
          </Link>
        </div>
      </Section>
    );
  }

  return (
    <div>
      <SEO title={post.title} description={post.excerpt} path={`/blog/${post.slug}`} type="article" />
      <ArticleSchema title={post.title} description={post.excerpt} datePublished={post.createdAt} url={`/blog/${post.slug}`} />
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "/" },
          { name: "Blog", url: "/blog" },
          { name: post.title, url: `/blog/${post.slug}` },
        ]}
      />
      <div className="relative pt-32 pb-16 md:pt-44 md:pb-24 section-brand-navy overflow-hidden">
        <div className="absolute top-0 right-0 -mr-40 -mt-40 w-[600px] h-[600px] bg-accent/15 rounded-full blur-[120px] pointer-events-none" aria-hidden="true" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-[400px] h-[400px] bg-rose-gold/8 rounded-full blur-[100px] pointer-events-none" aria-hidden="true" />
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <Link href="/blog" className="text-white/70 hover:text-white text-sm font-medium inline-flex items-center gap-2 mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Blog
          </Link>
          <div className="flex items-center gap-3 mb-6">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/20 text-accent text-xs font-display font-bold">
              <Tag className="w-3 h-3" /> {post.category}
            </span>
            <span className="flex items-center gap-1.5 text-white/60 text-xs font-medium">
              <Calendar className="w-3 h-3" />
              <time dateTime={post.createdAt}>
                {new Date(post.createdAt).toLocaleDateString("en-CA", { year: "numeric", month: "long", day: "numeric" })}
              </time>
            </span>
          </div>
          <h1 className="text-3xl md:text-5xl font-display font-extrabold text-white leading-tight">
            {post.title}
          </h1>
        </div>
      </div>

      <Section bg="white">
        <article className="max-w-3xl mx-auto prose prose-lg dark:prose-invert prose-headings:font-display prose-headings:text-primary prose-a:text-accent">
          {post.content.split("\n").map((paragraph, i) => {
            if (!paragraph.trim()) return null;
            if (paragraph.startsWith("## ")) {
              return <h2 key={i}>{paragraph.replace("## ", "")}</h2>;
            }
            if (paragraph.startsWith("### ")) {
              return <h3 key={i}>{paragraph.replace("### ", "")}</h3>;
            }
            return <p key={i}>{paragraph}</p>;
          })}
        </article>
      </Section>

      <Section bg="brand-light">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-display font-bold text-primary mb-4">Enjoyed this article?</h2>
          <p className="text-muted-foreground mb-8">Get in touch to discuss how we can help your business.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/blog" className="px-6 py-3 rounded-xl bg-secondary border border-border text-foreground font-semibold hover:border-accent transition-colors">
              More Articles
            </Link>
            <Link href="/contact" className="px-6 py-3 rounded-xl bg-accent text-white font-semibold hover:bg-accent/90 transition-colors">
              Contact Us
            </Link>
          </div>
        </div>
      </Section>
    </div>
  );
}
