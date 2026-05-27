"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Leaf,
  Heart,
  GraduationCap,
  Droplets,
  Users,
  Target,
  Calendar,
  TrendingUp,
  ArrowUpRight,
} from "lucide-react";

interface Milestone {
  label: string;
  reached: boolean;
}

interface CampaignDetail {
  id: string;
  title: string;
  category: string;
  description: string;
  raised: number;
  goal: number;
  donors: number;
  volunteers: number;
  startDate: string;
  endDate: string;
  imageSrc: string;
  icon: React.ComponentType<{ className?: string }>;
  progressColor: string;
  accentClass: string;
  milestones: Milestone[];
}

const CAMPAIGNS: CampaignDetail[] = [
  {
    id: "green-canopy",
    title: "Green Canopy Project",
    category: "Environment",
    description:
      "Our flagship reforestation initiative targeting 20,000 native saplings across Bankura district. Funds cover sapling purchase, protective fencing, composting materials, and volunteer transport.",
    raised: 325000,
    goal: 500000,
    donors: 48,
    volunteers: 120,
    startDate: "Jan 15, 2026",
    endDate: "Sep 30, 2026",
    imageSrc: "/Assets/Basic_Workflow.png",
    icon: Leaf,
    progressColor: "bg-primary-900",
    accentClass: "text-primary-900",
    milestones: [
      { label: "5,000 saplings planted", reached: true },
      { label: "10,000 saplings planted", reached: true },
      { label: "15,000 saplings planted", reached: false },
      { label: "20,000 saplings planted", reached: false },
    ],
  },
  {
    id: "blood-directory",
    title: "Sakti Blood Directory",
    category: "Healthcare",
    description:
      "Building a real-time web dashboard to match emergency blood donors with hospitals, combined with 10 weekend blood donation camps across Kolkata and surrounding districts.",
    raised: 185000,
    goal: 300000,
    donors: 32,
    volunteers: 85,
    startDate: "Feb 01, 2026",
    endDate: "Aug 15, 2026",
    imageSrc: "/Assets/Ecosystems.png",
    icon: Droplets,
    progressColor: "bg-alert-500",
    accentClass: "text-alert-500",
    milestones: [
      { label: "Dashboard MVP launched", reached: true },
      { label: "5 blood camps completed", reached: true },
      { label: "10 blood camps completed", reached: false },
      { label: "2,000+ registered donors", reached: false },
    ],
  },
  {
    id: "scholar-centers",
    title: "Sakti Scholar Centers",
    category: "Education",
    description:
      "Establishing modern learning centers in underserved communities, equipped with books, tablets, and volunteer-led tutoring sessions to support children's education and homework.",
    raised: 150000,
    goal: 400000,
    donors: 22,
    volunteers: 65,
    startDate: "Mar 01, 2026",
    endDate: "Dec 31, 2026",
    imageSrc: "/Assets/Workflows.png",
    icon: GraduationCap,
    progressColor: "bg-accent-500",
    accentClass: "text-accent-600",
    milestones: [
      { label: "First center opened in Barjora", reached: true },
      { label: "50 children enrolled", reached: true },
      { label: "3 centers operational", reached: false },
      { label: "200 children enrolled", reached: false },
    ],
  },
];

function formatCurrency(val: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(val);
}

export default function CampaignDashboard() {
  const totalRaised = CAMPAIGNS.reduce((sum, c) => sum + c.raised, 0);
  const totalGoal = CAMPAIGNS.reduce((sum, c) => sum + c.goal, 0);
  const totalDonors = CAMPAIGNS.reduce((sum, c) => sum + c.donors, 0);
  const totalVolunteers = CAMPAIGNS.reduce((sum, c) => sum + c.volunteers, 0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-surface-100/40 via-white to-surface-100/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-primary-900 font-heading font-semibold text-sm hover:underline mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>

        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-xl bg-primary-900/10 text-primary-900">
              <Target className="w-6 h-6" />
            </div>
            <span className="font-display font-semibold text-primary-700 uppercase tracking-widest text-sm">
              Campaign Tracking
            </span>
          </div>
          <h1 className="font-heading font-extrabold text-4xl text-primary-900 leading-tight">
            Campaign Progress Dashboard
          </h1>
          <p className="font-sans text-foreground/80 mt-2 max-w-2xl">
            Track progress across all active YSSF campaigns. Every rupee raised, every volunteer registered, and every milestone reached is reported in real-time.
          </p>
        </motion.div>

        {/* Summary Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="yssf-card p-5 bg-white border-primary-200/40 text-center"
          >
            <TrendingUp className="w-5 h-5 text-primary-900 mx-auto mb-2" />
            <p className="font-heading font-extrabold text-2xl text-primary-900">{formatCurrency(totalRaised)}</p>
            <p className="font-sans text-xs text-foreground/60 mt-1">Total Raised</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="yssf-card p-5 bg-white border-primary-200/40 text-center"
          >
            <Target className="w-5 h-5 text-accent-600 mx-auto mb-2" />
            <p className="font-heading font-extrabold text-2xl text-primary-900">{formatCurrency(totalGoal)}</p>
            <p className="font-sans text-xs text-foreground/60 mt-1">Combined Goal</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="yssf-card p-5 bg-white border-primary-200/40 text-center"
          >
            <Users className="w-5 h-5 text-primary-700 mx-auto mb-2" />
            <p className="font-heading font-extrabold text-2xl text-primary-900">{totalDonors}</p>
            <p className="font-sans text-xs text-foreground/60 mt-1">Total Donors</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="yssf-card p-5 bg-white border-primary-200/40 text-center"
          >
            <Heart className="w-5 h-5 text-alert-500 mx-auto mb-2" />
            <p className="font-heading font-extrabold text-2xl text-primary-900">{totalVolunteers}</p>
            <p className="font-sans text-xs text-foreground/60 mt-1">Volunteers Engaged</p>
          </motion.div>
        </div>

        {/* Detailed Campaign Cards */}
        <div className="space-y-8">
          {CAMPAIGNS.map((campaign, index) => {
            const progressPercent = Math.min(Math.round((campaign.raised / campaign.goal) * 100), 100);
            const IconComp = campaign.icon;

            return (
              <motion.div
                key={campaign.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="yssf-card overflow-hidden bg-white border-primary-200/40"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
                  {/* Campaign Image */}
                  <div className="lg:col-span-4 relative h-56 lg:h-auto">
                    <Image
                      src={campaign.imageSrc}
                      alt={campaign.title}
                      fill
                      sizes="(max-width: 1024px) 100vw, 33vw"
                      className="object-cover"
                    />
                    <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-heading font-bold ${
                      campaign.category === "Environment"
                        ? "bg-primary-900 text-white"
                        : campaign.category === "Healthcare"
                        ? "bg-alert-500 text-white"
                        : "bg-accent-500 text-primary-900"
                    }`}>
                      {campaign.category}
                    </div>
                  </div>

                  {/* Campaign Details */}
                  <div className="lg:col-span-8 p-6 lg:p-8 space-y-6">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <IconComp className={`w-5 h-5 ${campaign.accentClass}`} />
                          <h3 className="font-heading font-extrabold text-2xl text-primary-900">{campaign.title}</h3>
                        </div>
                        <p className="font-sans text-sm text-foreground/80 leading-relaxed">{campaign.description}</p>
                      </div>
                    </div>

                    {/* Progress */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-heading font-bold text-sm text-primary-900">{progressPercent}% Funded</span>
                        <span className="font-heading font-semibold text-xs text-foreground/70">
                          {formatCurrency(campaign.raised)} / {formatCurrency(campaign.goal)}
                        </span>
                      </div>
                      <div className="w-full h-4 bg-surface-100 rounded-full overflow-hidden border border-primary-200/20">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${progressPercent}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1.2, ease: "easeOut" }}
                          className={`h-full ${campaign.progressColor} rounded-full`}
                        />
                      </div>
                    </div>

                    {/* Stats Row */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      <div className="bg-surface-100/30 p-3 rounded-xl text-center">
                        <p className="font-heading font-extrabold text-lg text-primary-900">{campaign.donors}</p>
                        <p className="font-sans text-xs text-foreground/60">Donors</p>
                      </div>
                      <div className="bg-surface-100/30 p-3 rounded-xl text-center">
                        <p className="font-heading font-extrabold text-lg text-primary-900">{campaign.volunteers}</p>
                        <p className="font-sans text-xs text-foreground/60">Volunteers</p>
                      </div>
                      <div className="bg-surface-100/30 p-3 rounded-xl text-center">
                        <p className="font-heading font-semibold text-xs text-primary-900">{campaign.startDate}</p>
                        <p className="font-sans text-xs text-foreground/60">Started</p>
                      </div>
                      <div className="bg-surface-100/30 p-3 rounded-xl text-center">
                        <p className="font-heading font-semibold text-xs text-primary-900">{campaign.endDate}</p>
                        <p className="font-sans text-xs text-foreground/60">Target End</p>
                      </div>
                    </div>

                    {/* Milestones */}
                    <div>
                      <h4 className="font-heading font-bold text-xs text-primary-900 mb-3 flex items-center gap-1.5">
                        <Calendar className="w-4 h-4" /> Key Milestones
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {campaign.milestones.map((m) => (
                          <div
                            key={m.label}
                            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-heading font-semibold ${
                              m.reached
                                ? "bg-primary-900/10 text-primary-900 border border-primary-900/15"
                                : "bg-foreground/3 text-foreground/50 border border-foreground/8"
                            }`}
                          >
                            <span className={`w-2 h-2 rounded-full ${m.reached ? "bg-primary-900" : "bg-foreground/20"}`} />
                            {m.label}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <Link
            href="/#donate"
            className="inline-flex items-center gap-2 px-8 py-4 bg-accent-500 hover:bg-accent-600 text-primary-900 font-heading font-extrabold rounded-2xl transition-all shadow-md shadow-accent-500/25 hover:shadow-lg hover:-translate-y-0.5 border-2 border-primary-900/10"
          >
            Support a Campaign
            <ArrowUpRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
