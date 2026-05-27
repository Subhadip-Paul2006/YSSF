"use client";

import { use, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, Clock, User, Share2, Tag, ArrowRight, Loader2 } from "lucide-react";
import { apiGetBlogPost, apiGetBlogPosts } from "@/lib/api";

interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  authorRole: string;
  date: string;
  readTime: string;
  imageSrc: string;
  tags: string[];
  content: string[];
}

interface RelatedPost {
  slug: string;
  title: string;
  category: string;
  imageSrc: string;
}

const CATEGORY_COLORS: Record<string, string> = {
  Environment: "bg-primary-900 text-white",
  Healthcare: "bg-alert-500 text-white",
  Education: "bg-accent-500 text-primary-900",
  Transparency: "bg-primary-700 text-white",
  Youth: "bg-warning-500 text-white",
};

export default function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);

  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [relatedPosts, setRelatedPosts] = useState<RelatedPost[]>([]);

  // Fetch blog post detail
  useEffect(() => {
    let cancelled = false;
    const fetchPost = async () => {
      setLoading(true);
      try {
        const data = await apiGetBlogPost(slug);
        if (!cancelled) {
          if (data) {
            setPost({
              slug: data.slug,
              title: data.title,
              excerpt: data.excerpt,
              category: data.category,
              author: data.author,
              authorRole: data.authorRole || "Contributor",
              date: new Date(data.createdAt).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              }),
              readTime: data.readTime,
              imageSrc: data.imageSrc,
              tags: data.tags ? data.tags.split(",").map((t) => t.trim()) : [],
              content: data.content.split("\n\n"),
            });
          } else {
            setPost(null);
          }
        }
      } catch {
        if (!cancelled) setPost(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchPost();
    return () => { cancelled = true; };
  }, [slug]);

  // Fetch related posts
  useEffect(() => {
    if (!post) return;
    let cancelled = false;
    apiGetBlogPosts({ category: post.category }).then((data) => {
      if (!cancelled) {
        setRelatedPosts(
          data
            .filter((p) => p.slug !== post.slug)
            .slice(0, 2)
            .map((p) => ({
              slug: p.slug,
              title: p.title,
              category: p.category,
              imageSrc: p.imageSrc,
            }))
        );
      }
    });
    return () => { cancelled = true; };
  }, [post]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <Loader2 className="w-10 h-10 text-primary-900 mx-auto mb-4 animate-spin" />
        <p className="font-heading font-bold text-sm text-primary-900/60">Loading article...</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <h1 className="font-heading font-extrabold text-3xl text-primary-900 mb-4">Article Not Found</h1>
        <p className="font-sans text-foreground/80 mb-8">The blog post you are looking for does not exist or has been removed.</p>
        <Link
          href="/blog"
          className="px-6 py-3 bg-primary-900 hover:bg-primary-800 text-white font-heading font-bold text-sm rounded-xl transition-all shadow-md"
        >
          Back to Blog
        </Link>
      </div>
    );
  }

  return (
    <div className="relative overflow-x-hidden">
      {/* Article Header */}
      <section className="bg-gradient-to-b from-surface-100/60 via-surface-100/20 to-white pt-12 pb-12 lg:pt-16 lg:pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Link */}
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-primary-900 font-heading font-semibold text-sm hover:underline mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Blog</span>
          </Link>

          {/* Category Badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-4"
          >
            <span className={`px-3 py-1 rounded-full text-xs font-heading font-bold ${CATEGORY_COLORS[post.category] || "bg-primary-900 text-white"}`}>
              {post.category}
            </span>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="font-heading font-extrabold text-3xl sm:text-4xl lg:text-5xl text-primary-900 leading-tight mb-6"
          >
            {post.title}
          </motion.h1>

          {/* Meta Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-wrap items-center gap-4 text-sm text-foreground/70 font-sans"
          >
            <span className="flex items-center gap-1.5">
              <User className="w-4 h-4 text-primary-900" />
              <span className="font-heading font-semibold text-primary-900">{post.author}</span>
              <span className="text-foreground/50">({post.authorRole})</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-primary-900" />
              {post.date}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-primary-900" />
              {post.readTime}
            </span>
          </motion.div>
        </div>
      </section>

      {/* Featured Image */}
      <section className="pb-12 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="relative w-full aspect-[16/9] rounded-3xl overflow-hidden shadow-soft border-2 border-primary-200/50"
          >
            <Image
              src={post.imageSrc}
              alt={post.title}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 800px"
              className="object-cover"
            />
          </motion.div>
        </div>
      </section>

      {/* Article Body */}
      <section className="pb-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Main Content */}
            <motion.article
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="lg:col-span-8 space-y-6"
            >
              {/* Lead paragraph */}
              <p className="font-sans text-lg text-foreground leading-relaxed font-medium">
                {post.excerpt}
              </p>

              {/* Body paragraphs */}
              {post.content.map((paragraph, index) => (
                <p key={index} className="font-sans text-base text-foreground/85 leading-relaxed">
                  {paragraph}
                </p>
              ))}

              {/* Tags */}
              {post.tags.length > 0 && (
                <div className="border-t border-primary-100 pt-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Tag className="w-4 h-4 text-primary-900" />
                    <span className="font-heading font-bold text-xs text-primary-900 uppercase tracking-wider">Tags</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1.5 rounded-full bg-surface-100 text-primary-900 text-xs font-heading font-semibold border border-primary-200/30"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Share */}
              <div className="flex items-center gap-3 pt-4">
                <span className="font-heading font-bold text-xs text-primary-900 flex items-center gap-1.5 font-semibold">
                  <Share2 className="w-4 h-4" />
                  Share this article
                </span>
              </div>
            </motion.article>

            {/* Sidebar */}
            <aside className="lg:col-span-4 space-y-8">
              {/* Author Card */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="yssf-card p-6 border border-primary-200/40 bg-surface-100/20"
              >
                <h3 className="font-heading font-bold text-sm text-primary-900 mb-3 uppercase tracking-wider">About the Author</h3>
                <div className="w-12 h-12 rounded-full bg-primary-900 flex items-center justify-center text-white font-heading font-bold text-lg mb-3">
                  {post.author.charAt(0)}
                </div>
                <p className="font-heading font-bold text-primary-900 text-sm">{post.author}</p>
                <p className="font-sans text-xs text-foreground/70 mt-0.5">{post.authorRole}</p>
              </motion.div>

              {/* Call to Action */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="yssf-card p-6 border-2 border-accent-500/30 bg-accent-500/5"
              >
                <h3 className="font-heading font-extrabold text-lg text-primary-900 mb-2">Support Our Work</h3>
                <p className="font-sans text-xs text-foreground/80 leading-relaxed mb-4">
                  Every donation directly funds grassroots campaigns like this one. Your contribution makes a real difference.
                </p>
                <div className="space-y-2">
                  <Link
                    href="/register?role=volunteer"
                    className="block w-full py-2.5 bg-primary-900 hover:bg-primary-800 text-white font-heading font-bold text-xs rounded-xl text-center transition-all shadow-sm"
                  >
                    Join As Volunteer
                  </Link>
                  <Link
                    href="/#donate"
                    className="block w-full py-2.5 bg-accent-500 hover:bg-accent-600 text-primary-900 font-heading font-bold text-xs rounded-xl text-center transition-all border-2 border-primary-900/10"
                  >
                    Donate Now
                  </Link>
                </div>
              </motion.div>
            </aside>
          </div>
        </div>
      </section>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="py-16 bg-surface-100/20 border-t border-primary-200/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-heading font-extrabold text-2xl text-primary-900 mb-8">Related Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {relatedPosts.map((related, index) => (
                <motion.div
                  key={related.slug}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Link
                    href={`/blog/${related.slug}`}
                    className="yssf-card overflow-hidden flex gap-6 p-6 border border-primary-200/40 bg-white group"
                  >
                    <div className="relative w-32 h-32 flex-shrink-0 rounded-xl overflow-hidden bg-primary-200/20">
                      <Image
                        src={related.imageSrc}
                        alt={related.title}
                        fill
                        sizes="128px"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div className="flex flex-col justify-center">
                      <span className={`inline-block w-fit px-2.5 py-0.5 rounded-full text-[10px] font-heading font-bold mb-2 ${CATEGORY_COLORS[related.category] || "bg-primary-900 text-white"}`}>
                        {related.category}
                      </span>
                      <h3 className="font-heading font-bold text-sm text-primary-900 leading-tight group-hover:text-primary-700 transition-colors mb-2">
                        {related.title}
                      </h3>
                      <span className="flex items-center gap-1 text-xs font-heading font-semibold text-primary-900 group-hover:gap-2 transition-all">
                        Read <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
