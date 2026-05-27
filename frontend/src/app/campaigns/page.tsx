"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Leaf, Loader2 } from "lucide-react";
import CampaignCard from "@/components/CampaignCard";
import { apiGetCampaigns } from "@/lib/api";

const CATEGORIES = ["All", "Environment", "Healthcare", "Education"];

type CampaignItem = Awaited<ReturnType<typeof apiGetCampaigns>>[number];

export default function CampaignsPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [campaigns, setCampaigns] = useState<CampaignItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const fetchCampaigns = async () => {
      setLoading(true);
      try {
        const data = await apiGetCampaigns({ category: activeCategory });
        if (!cancelled) setCampaigns(data);
      } catch {
        if (!cancelled) setCampaigns([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchCampaigns();
    return () => { cancelled = true; };
  }, [activeCategory]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-surface-100/40 via-white to-surface-100/20">
      {/* Hero */}
      <section className="py-20 bg-gradient-to-b from-surface-100/60 to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-900/10 border border-primary-900/15 text-primary-900 text-xs font-heading font-semibold">
            <Leaf className="w-4 h-4 text-accent-500" /> Active Campaigns
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="font-heading font-extrabold text-4xl sm:text-5xl text-primary-900">
            Our <span className="handwritten-highlight inline-block font-handwritten text-accent-500">Campaigns</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="font-sans text-foreground/75 max-w-lg mx-auto">
            Select a campaign that resonates with you. Your donation directly funds materials, transportation, and setup costs for our community actions.
          </motion.p>
        </div>
      </section>

      {/* Filters */}
      <section className="pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-2">
            {CATEGORIES.map((cat) => (
              <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-5 py-2.5 rounded-xl font-heading font-bold text-xs transition-all border cursor-pointer ${activeCategory === cat ? "bg-primary-900 border-primary-900 text-white shadow-md" : "bg-white border-primary-200 text-primary-900 hover:bg-surface-100"}`}>{cat}</button>
            ))}
          </div>
        </div>
      </section>

      {/* Campaign Grid */}
      <section className="pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="text-center py-20">
              <Loader2 className="w-10 h-10 text-primary-900 mx-auto mb-4 animate-spin" />
              <p className="font-heading font-bold text-sm text-primary-900/60">Loading campaigns...</p>
            </div>
          ) : campaigns.length === 0 ? (
            <div className="text-center py-20">
              <Leaf className="w-12 h-12 text-primary-200 mx-auto mb-4" />
              <p className="font-heading font-bold text-lg text-primary-900/50">No campaigns found.</p>
              <p className="font-sans text-sm text-foreground/60 mt-1">Try selecting a different category.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {campaigns.map((campaign, index) => (
                <CampaignCard
                  key={campaign.id}
                  slug={campaign.slug}
                  title={campaign.title}
                  category={campaign.category}
                  description={campaign.description}
                  raised={campaign.raised}
                  goal={campaign.goal}
                  imageSrc={campaign.imageSrc}
                  accentClass={campaign.accentClass}
                  progressColor={campaign.progressColor}
                  delay={index * 0.1}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
