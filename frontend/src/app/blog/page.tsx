"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Search, Calendar, Clock, ArrowRight, Tag, User, Loader2 } from "lucide-react";
import { apiGetBlogPosts } from "@/lib/api";

const CATEGORIES = ["All", "Environment", "Healthcare", "Education", "Transparency", "Youth"];

const CATEGORY_COLORS: Record<string, string> = {
  Environment: "bg-primary-900 text-white",
  Healthcare: "bg-alert-500 text-white",
  Education: "bg-accent-500 text-primary-900",
  Transparency: "bg-primary-700 text-white",
  Youth: "bg-warning-500 text-white",
};

type BlogPostItem = Awaited<ReturnType<typeof apiGetBlogPosts>>[number];

export default function BlogPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [posts, setPosts] = useState<BlogPostItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const data = await apiGetBlogPosts({
          category: activeCategory,
          search: searchQuery || undefined,
        });
        if (!cancelled) setPosts(data);
      } catch {
        if (!cancelled) setPosts([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    const timer = setTimeout(fetchPosts, 300);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [activeCategory, searchQuery]);

  return (
    <div className="relative overflow-x-hidden">
      {/* Hero Header */}
      <section className="bg-gradient-to-b from-surface-100/60 via-surface-100/20 to-white pt-16 pb-16 lg:pt-24 lg:pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-900/10 border border-primary-900/15 text-primary-900 text-xs sm:text-sm font-heading font-semibold"
          >
            <Tag className="w-4 h-4 text-accent-500" />
            <span>Stories of Impact</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-heading font-extrabold text-4xl sm:text-5xl text-primary-900 leading-tight"
          >
            YSSF{" "}
            <span className="handwritten-highlight inline-block font-handwritten text-accent-500 transform rotate-[-1deg] px-2 text-5xl sm:text-6xl">
              Blog
            </span>{" "}
            & Reports
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="font-sans text-lg text-foreground/80 leading-relaxed max-w-2xl mx-auto"
          >
            Campaign recaps, financial transparency reports, volunteer stories, and the latest updates from our grassroots community initiatives.
          </motion.p>
        </div>
      </section>

      {/* Search & Filters */}
      <section className="bg-white border-b border-primary-900/5 sticky top-20 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            {/* Search Bar */}
            <div className="relative w-full sm:w-96">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-foreground/50" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search articles, tags, campaigns..."
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-primary-200 font-sans text-sm focus:outline-none focus:ring-2 focus:ring-accent-500 text-foreground"
              />
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap items-center gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-heading font-bold transition-all border cursor-pointer ${
                    activeCategory === cat
                      ? "bg-primary-900 border-primary-900 text-white shadow-sm"
                      : "bg-transparent border-primary-200 text-primary-900/80 hover:bg-surface-100"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="text-center py-20">
              <Loader2 className="w-10 h-10 text-primary-900 mx-auto mb-4 animate-spin" />
              <p className="font-heading font-bold text-sm text-primary-900/60">Loading articles...</p>
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-20">
              <p className="font-heading font-bold text-xl text-primary-900/50">No articles found matching your search.</p>
              <p className="font-sans text-sm text-foreground/60 mt-2">Try adjusting your filters or search query.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post, index) => {
                const formattedDate = new Date(post.createdAt).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                });
                const tagList = post.tags ? post.tags.split(",").map((t) => t.trim()) : [];

                return (
                  <motion.div
                    key={post.slug}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
                  >
                    <Link
                      href={`/blog/${post.slug}`}
                      className="yssf-card overflow-hidden flex flex-col h-full border border-primary-200/40 bg-white group"
                    >
                      {/* Post Image */}
                      <div className="relative h-48 w-full overflow-hidden bg-primary-200/20">
                        <Image
                          src={post.imageSrc}
                          alt={post.title}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-heading font-bold shadow-sm ${CATEGORY_COLORS[post.category] || "bg-primary-900 text-white"}`}>
                          {post.category}
                        </div>
                      </div>

                      {/* Post Content */}
                      <div className="p-6 flex flex-col flex-grow">
                        <div className="flex items-center gap-3 text-xs text-foreground/60 font-sans mb-3">
                          <span className="flex items-center gap-1">
                            <User className="w-3.5 h-3.5" />
                            {post.author}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" />
                            {formattedDate}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            {post.readTime}
                          </span>
                        </div>

                        <h2 className="font-heading font-extrabold text-lg text-primary-900 mb-3 leading-tight group-hover:text-primary-700 transition-colors">
                          {post.title}
                        </h2>

                        <p className="font-sans text-sm text-foreground/80 leading-relaxed mb-6 flex-grow">
                          {post.excerpt}
                        </p>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-1.5 mb-4">
                          {tagList.slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              className="px-2.5 py-0.5 rounded-full bg-surface-100 text-primary-900 text-[10px] font-heading font-semibold border border-primary-200/30"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>

                        <div className="flex items-center gap-1.5 text-primary-900 font-heading font-semibold text-xs group-hover:gap-3 transition-all">
                          <span>Read Full Article</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
