"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  TrendingUp,
  Heart,
  Leaf,
  GraduationCap,
  Droplets,
  Users,
  Calendar,
  ArrowUpRight,
} from "lucide-react";

const DONORS = [
  {
    id: 1,
    name: "Rajeev Sharma",
    type: "Individual",
    totalDonated: 85000,
    campaigns: 4,
    lastDonation: "May 22, 2026",
    status: "Active",
    initials: "RS",
    color: "bg-primary-900",
  },
  {
    id: 2,
    name: "Amitava Mitra",
    type: "Individual",
    totalDonated: 50000,
    campaigns: 2,
    lastDonation: "May 18, 2026",
    status: "Active",
    initials: "AM",
    color: "bg-accent-500",
  },
  {
    id: 3,
    name: "GreenLeaf Pvt Ltd",
    type: "Corporate",
    totalDonated: 200000,
    campaigns: 3,
    lastDonation: "May 10, 2026",
    status: "Active",
    initials: "GL",
    color: "bg-primary-700",
  },
  {
    id: 4,
    name: "Priya Banerjee",
    type: "Individual",
    totalDonated: 25000,
    campaigns: 1,
    lastDonation: "Apr 30, 2026",
    status: "Active",
    initials: "PB",
    color: "bg-alert-500",
  },
  {
    id: 5,
    name: "Narayana Group CSR",
    type: "Corporate",
    totalDonated: 150000,
    campaigns: 5,
    lastDonation: "May 15, 2026",
    status: "Active",
    initials: "NG",
    color: "bg-warning-500",
  },
  {
    id: 6,
    name: "Suman Das",
    type: "Individual",
    totalDonated: 15000,
    campaigns: 1,
    lastDonation: "Mar 28, 2026",
    status: "Inactive",
    initials: "SD",
    color: "bg-primary-400",
  },
];

const CAMPAIGN_ALLOCATIONS = [
  { name: "Green Canopy Project", icon: Leaf, amount: 325000, color: "bg-primary-900", percent: 43 },
  { name: "Sakti Blood Directory", icon: Droplets, amount: 185000, color: "bg-alert-500", percent: 25 },
  { name: "Sakti Scholar Centers", icon: GraduationCap, amount: 150000, color: "bg-accent-500", percent: 20 },
  { name: "General Operations", icon: Users, amount: 90000, color: "bg-primary-700", percent: 12 },
];

function formatCurrency(val: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(val);
}

export default function DonorDashboard() {
  const totalRaised = DONORS.reduce((sum, d) => sum + d.totalDonated, 0);
  const activeDonors = DONORS.filter((d) => d.status === "Active").length;

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
            <div className="p-2 rounded-xl bg-accent-500/15 text-accent-600">
              <Heart className="w-6 h-6" />
            </div>
            <span className="font-display font-semibold text-primary-700 uppercase tracking-widest text-sm">
              Donor Transparency
            </span>
          </div>
          <h1 className="font-heading font-extrabold text-4xl text-primary-900 leading-tight">
            Donor Contribution Dashboard
          </h1>
          <p className="font-sans text-foreground/80 mt-2 max-w-2xl">
            Full visibility into donor contributions, fund allocation across campaigns, and real-time impact metrics.
            YSSF is committed to 100% financial transparency.
          </p>
        </motion.div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="yssf-card p-6 bg-white border-primary-200/40"
          >
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-5 h-5 text-primary-900" />
              <span className="font-heading font-semibold text-xs text-primary-900/70">Total Raised</span>
            </div>
            <p className="font-heading font-extrabold text-3xl text-primary-900">{formatCurrency(totalRaised)}</p>
            <p className="font-sans text-xs text-foreground/60 mt-1">Across all active campaigns</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="yssf-card p-6 bg-white border-primary-200/40"
          >
            <div className="flex items-center gap-2 mb-3">
              <Users className="w-5 h-5 text-accent-600" />
              <span className="font-heading font-semibold text-xs text-primary-900/70">Active Donors</span>
            </div>
            <p className="font-heading font-extrabold text-3xl text-primary-900">{activeDonors}</p>
            <p className="font-sans text-xs text-foreground/60 mt-1">Verified contributors</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="yssf-card p-6 bg-white border-primary-200/40"
          >
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="w-5 h-5 text-primary-700" />
              <span className="font-heading font-semibold text-xs text-primary-900/70">Avg Contribution</span>
            </div>
            <p className="font-heading font-extrabold text-3xl text-primary-900">{formatCurrency(Math.round(totalRaised / DONORS.length))}</p>
            <p className="font-sans text-xs text-foreground/60 mt-1">Per donor average</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="yssf-card p-6 bg-white border-primary-200/40"
          >
            <div className="flex items-center gap-2 mb-3">
              <Leaf className="w-5 h-5 text-alert-500" />
              <span className="font-heading font-semibold text-xs text-primary-900/70">Tax Receipts Issued</span>
            </div>
            <p className="font-heading font-extrabold text-3xl text-primary-900">100%</p>
            <p className="font-sans text-xs text-foreground/60 mt-1">80G compliant receipts</p>
          </motion.div>
        </div>

        {/* Fund Allocation Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="yssf-card p-8 bg-white border-primary-200/40 mb-12"
        >
          <h2 className="font-heading font-extrabold text-xl text-primary-900 mb-6">Fund Allocation by Campaign</h2>
          <div className="space-y-5">
            {CAMPAIGN_ALLOCATIONS.map((campaign) => {
              const IconComp = campaign.icon;
              return (
                <div key={campaign.name}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className={`p-1.5 rounded-lg ${campaign.color}/10`}>
                        <IconComp className="w-4 h-4 text-primary-900" />
                      </div>
                      <span className="font-heading font-semibold text-sm text-primary-900">{campaign.name}</span>
                    </div>
                    <span className="font-heading font-bold text-sm text-primary-900">{formatCurrency(campaign.amount)}</span>
                  </div>
                  <div className="w-full h-3 bg-surface-100 rounded-full overflow-hidden border border-primary-200/20">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${campaign.percent}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className={`h-full ${campaign.color} rounded-full`}
                    />
                  </div>
                  <p className="font-sans text-xs text-foreground/60 mt-1">{campaign.percent}% of total funds</p>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Donor List Table */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="yssf-card overflow-hidden bg-white border-primary-200/40"
        >
          <div className="p-6 border-b border-primary-100">
            <h2 className="font-heading font-extrabold text-xl text-primary-900">Registered Donors</h2>
            <p className="font-sans text-xs text-foreground/60 mt-1">All donor identities are verified. PAN numbers masked for privacy.</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-surface-100/30">
                <tr>
                  <th className="text-left px-6 py-3 font-heading font-semibold text-xs text-primary-900/70 uppercase tracking-wider">Donor</th>
                  <th className="text-left px-6 py-3 font-heading font-semibold text-xs text-primary-900/70 uppercase tracking-wider">Type</th>
                  <th className="text-left px-6 py-3 font-heading font-semibold text-xs text-primary-900/70 uppercase tracking-wider">Total Contributed</th>
                  <th className="text-left px-6 py-3 font-heading font-semibold text-xs text-primary-900/70 uppercase tracking-wider">Campaigns</th>
                  <th className="text-left px-6 py-3 font-heading font-semibold text-xs text-primary-900/70 uppercase tracking-wider">Last Donation</th>
                  <th className="text-left px-6 py-3 font-heading font-semibold text-xs text-primary-900/70 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-primary-100/50">
                {DONORS.map((donor) => (
                  <tr key={donor.id} className="hover:bg-surface-100/20 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-full ${donor.color} flex items-center justify-center text-white font-heading font-bold text-xs`}>
                          {donor.initials}
                        </div>
                        <span className="font-heading font-semibold text-sm text-primary-900">{donor.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-heading font-semibold ${
                        donor.type === "Corporate"
                          ? "bg-primary-700/10 text-primary-700 border border-primary-700/20"
                          : "bg-surface-100 text-primary-900 border border-primary-200/30"
                      }`}>
                        {donor.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-heading font-bold text-sm text-primary-900">{formatCurrency(donor.totalDonated)}</td>
                    <td className="px-6 py-4 font-sans text-sm text-foreground/80">{donor.campaigns}</td>
                    <td className="px-6 py-4 font-sans text-sm text-foreground/70">{donor.lastDonation}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-heading font-semibold ${
                        donor.status === "Active"
                          ? "bg-primary-900/10 text-primary-900 border border-primary-900/15"
                          : "bg-foreground/5 text-foreground/60 border border-foreground/10"
                      }`}>
                        {donor.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <Link
            href="/register?role=donor"
            className="inline-flex items-center gap-2 px-8 py-4 bg-accent-500 hover:bg-accent-600 text-primary-900 font-heading font-extrabold rounded-2xl transition-all shadow-md shadow-accent-500/25 hover:shadow-lg hover:-translate-y-0.5 border-2 border-primary-900/10"
          >
            Become a Verified Donor
            <ArrowUpRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
