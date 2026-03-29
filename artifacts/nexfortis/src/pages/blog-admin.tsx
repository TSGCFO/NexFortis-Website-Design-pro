import { useState } from "react";
import { Section } from "@/components/ui-elements";
import { SEO } from "@/components/seo";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import { Plus, Pencil, Trash2, Eye, EyeOff, ArrowLeft, Save, X } from "lucide-react";
import { Link } from "wouter";

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
  updatedAt: string;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function PostEditor({ post, onClose }: { post?: BlogPost; onClose: () => void }) {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    title: post?.title || "",
    slug: post?.slug || "",
    excerpt: post?.excerpt || "",
    content: post?.content || "",
    category: post?.category || "",
    coverImage: post?.coverImage || "",
    published: post?.published || false,
  });
  const [autoSlug, setAutoSlug] = useState(!post);

  const saveMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      if (post) {
        return apiFetch(`/blog/posts/${post.id}`, { method: "PUT", body: JSON.stringify(data) });
      }
      return apiFetch("/blog/posts", { method: "POST", body: JSON.stringify(data) });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blog-posts-admin"] });
      onClose();
    },
  });

  const handleTitleChange = (title: string) => {
    setFormData(prev => ({
      ...prev,
      title,
      ...(autoSlug ? { slug: slugify(title) } : {}),
    }));
  };

  return (
    <div className="bg-card rounded-2xl border border-border p-8">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-display font-bold text-primary">
          {post ? "Edit Post" : "New Post"}
        </h2>
        <button onClick={onClose} className="p-2 text-muted-foreground hover:text-foreground transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-primary mb-2">Title</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => handleTitleChange(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-input bg-background text-foreground focus:ring-2 focus:ring-accent focus:border-transparent"
            placeholder="Post title"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-primary mb-2">
            Slug
            {autoSlug && !post && <span className="text-muted-foreground font-normal ml-2">(auto-generated)</span>}
          </label>
          <input
            type="text"
            value={formData.slug}
            onChange={(e) => { setAutoSlug(false); setFormData(prev => ({ ...prev, slug: e.target.value })); }}
            className="w-full px-4 py-3 rounded-xl border border-input bg-background text-foreground focus:ring-2 focus:ring-accent focus:border-transparent"
            placeholder="post-url-slug"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-primary mb-2">Category</label>
            <input
              type="text"
              value={formData.category}
              onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
              className="w-full px-4 py-3 rounded-xl border border-input bg-background text-foreground focus:ring-2 focus:ring-accent focus:border-transparent"
              placeholder="e.g. Microsoft 365, IT Consulting"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-primary mb-2">Cover Image URL</label>
            <input
              type="text"
              value={formData.coverImage}
              onChange={(e) => setFormData(prev => ({ ...prev, coverImage: e.target.value }))}
              className="w-full px-4 py-3 rounded-xl border border-input bg-background text-foreground focus:ring-2 focus:ring-accent focus:border-transparent"
              placeholder="https://..."
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-primary mb-2">Excerpt</label>
          <textarea
            value={formData.excerpt}
            onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
            className="w-full px-4 py-3 rounded-xl border border-input bg-background text-foreground focus:ring-2 focus:ring-accent focus:border-transparent resize-y"
            rows={3}
            placeholder="Short description shown in the blog listing..."
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-primary mb-2">
            Content
            <span className="text-muted-foreground font-normal ml-2">(use ## for headings)</span>
          </label>
          <textarea
            value={formData.content}
            onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
            className="w-full px-4 py-3 rounded-xl border border-input bg-background text-foreground focus:ring-2 focus:ring-accent focus:border-transparent resize-y font-mono text-sm"
            rows={15}
            placeholder="Write your post content here..."
          />
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setFormData(prev => ({ ...prev, published: !prev.published }))}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${formData.published ? "bg-accent" : "bg-border"}`}
          >
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${formData.published ? "translate-x-6" : "translate-x-1"}`} />
          </button>
          <span className="text-sm font-medium text-foreground">
            {formData.published ? "Published" : "Draft"}
          </span>
        </div>

        <div className="flex items-center gap-4 pt-4">
          <button
            onClick={() => saveMutation.mutate(formData)}
            disabled={saveMutation.isPending || !formData.title || !formData.slug || !formData.category || !formData.excerpt || !formData.content}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-accent text-white font-semibold hover:bg-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="w-4 h-4" />
            {saveMutation.isPending ? "Saving..." : "Save Post"}
          </button>
          <button onClick={onClose} className="px-6 py-3 rounded-xl border border-border text-foreground font-semibold hover:bg-secondary transition-colors">
            Cancel
          </button>
          {saveMutation.isError && (
            <p className="text-destructive text-sm" role="alert">
              {(saveMutation.error as Error).message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default function BlogAdmin() {
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState<BlogPost | "new" | null>(null);

  const { data: posts = [], isLoading } = useQuery<BlogPost[]>({
    queryKey: ["blog-posts-admin"],
    queryFn: () => apiFetch<BlogPost[]>("/blog/posts/all"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => apiFetch(`/blog/posts/${id}`, { method: "DELETE" }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["blog-posts-admin"] }),
  });

  const togglePublishMutation = useMutation({
    mutationFn: ({ id, published }: { id: number; published: boolean }) =>
      apiFetch(`/blog/posts/${id}`, { method: "PUT", body: JSON.stringify({ published }) }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["blog-posts-admin"] }),
  });

  if (editing) {
    return (
      <Section bg="white">
        <div className="max-w-4xl mx-auto pt-10">
          <PostEditor
            post={editing === "new" ? undefined : editing}
            onClose={() => setEditing(null)}
          />
        </div>
      </Section>
    );
  }

  return (
    <div>
      <SEO title="Blog Manager" description="Manage blog posts for NexFortis IT Solutions." path="/blog/admin" noIndex />
      <div className="relative pt-32 pb-12 md:pt-44 md:pb-16 bg-primary overflow-hidden">
        <div className="absolute top-0 right-0 -mr-40 -mt-40 w-[600px] h-[600px] bg-accent/20 rounded-full blur-[100px] mix-blend-screen pointer-events-none" aria-hidden="true" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <Link href="/blog" className="text-white/70 hover:text-white text-sm font-medium inline-flex items-center gap-2 mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Blog
          </Link>
          <h1 className="text-3xl md:text-5xl font-display font-extrabold text-white">Blog Manager</h1>
        </div>
      </div>

      <Section bg="white">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <p className="text-muted-foreground">{posts.length} post{posts.length !== 1 ? "s" : ""}</p>
            <button
              onClick={() => setEditing("new")}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-accent text-white font-semibold hover:bg-accent/90 transition-colors"
            >
              <Plus className="w-4 h-4" /> New Post
            </button>
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <div className="w-8 h-8 border-3 border-accent border-t-transparent rounded-full animate-spin mx-auto" />
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-20 bg-secondary rounded-2xl border border-border">
              <p className="text-xl font-display font-bold text-primary mb-2">No posts yet</p>
              <p className="text-muted-foreground mb-6">Create your first blog post to get started.</p>
              <button
                onClick={() => setEditing("new")}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-accent text-white font-semibold hover:bg-accent/90 transition-colors"
              >
                <Plus className="w-4 h-4" /> Create Post
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {posts.map((post) => (
                <div
                  key={post.id}
                  className="flex items-center justify-between p-6 bg-card rounded-xl border border-border hover:border-accent/30 transition-colors"
                >
                  <div className="min-w-0 flex-1 mr-4">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-bold text-primary truncate">{post.title}</h3>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${post.published ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"}`}>
                        {post.published ? "Published" : "Draft"}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">{post.excerpt}</p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                      <span>{post.category}</span>
                      <span>{new Date(post.createdAt).toLocaleDateString("en-CA")}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => togglePublishMutation.mutate({ id: post.id, published: !post.published })}
                      className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                      title={post.published ? "Unpublish" : "Publish"}
                    >
                      {post.published ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => setEditing(post)}
                      className="p-2 rounded-lg text-muted-foreground hover:text-accent hover:bg-secondary transition-colors"
                      title="Edit"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => { if (confirm("Delete this post?")) deleteMutation.mutate(post.id); }}
                      className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-secondary transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Section>
    </div>
  );
}
