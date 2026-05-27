"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Shield,
  Eye,
  FileText,
  CheckCircle2,
  Lock,
  Users,
  Heart,
  Leaf,
  Globe,
  ArrowUpRight,
  Mail,
  Phone,
  MapPin,
  Scale,
  TrendingUp,
} from "lucide-react";
import { apiGetAdminStats, type AdminStatsResponse } from "@/lib/api";

function formatCurrency(val: number) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(val);
}

const TRANSPARENCY_PILLARS = [
  {
    icon: Eye,
    title: "Open Books Policy",
    description:
      "Every rupee received and spent is documented on our public financial ledger. Quarterly audits by independent CAs ensure accuracy.",
    color: "text-primary-900",
    bg: "bg-primary-900/10",
  },
  {
    icon: FileText,
    title: "Verified Registration",
    description:
      "YSSF is a registered trust (YSSF/2024/WB098) with valid 80G tax exemption status. All regulatory documents are available for download.",
    color: "text-accent-600",
    bg: "bg-accent-500/10",
  },
  {
    icon: Users,
    title: "Donor Identity Protection",
    description:
      "While we publish contribution totals, individual donor PAN numbers and personal data are masked. We comply with India's data protection guidelines.",
    color: "text-primary-700",
    bg: "bg-primary-700/10",
  },
  {
    icon: Scale,
    title: "Ethical Fund Utilization",
    description:
      "At least 80% of all donations go directly to campaign operations. Administrative costs are capped and fully disclosed in our quarterly reports.",
    color: "text-warning-500",
    bg: "bg-warning-500/10",
  },
];

const COMMITTEE_MEMBERS = [
  { name: "Arpan Ghosh", role: "Chairperson", initials: "AG", color: "bg-primary-900" },
  { name: "Moumita Das", role: "Treasurer & Finance Lead", initials: "MD", color: "bg-accent-500" },
  { name: "Rahul Saha", role: "Volunteer Operations Director", initials: "RS", color: "bg-primary-700" },
  { name: "Dr. Nandini Roy", role: "Medical Camp Coordinator", initials: "NR", color: "bg-alert-500" },
  { name: "Subhadeep Pal", role: "Education Programs Lead", initials: "SP", color: "bg-warning-500" },
  { name: "Tania Khatun", role: "Environmental Projects Lead", initials: "TK", color: "bg-primary-400" },
];

const FAQ_ITEMS = [
  {
    q: "How does YSSF verify that donated funds are used correctly?",
    a: "All funds are held in registered bank accounts with dual-signatory access. Every transaction requires approval from the Treasurer and Chairperson. Quarterly audits by an independent Chartered Accountant verify all expenses against receipts and invoices.",
  },
  {
    q: "Is my donation eligible for tax exemption?",
    a: "Yes. YSSF holds a valid 80G certificate. When you donate, you receive an automated tax receipt via email within 48 hours that you can use for income tax deductions under Section 80G of the Income Tax Act.",
  },
  {
    q: "Can I visit a YSSF campaign in person?",
    a: "Absolutely. We encourage donors and supporters to visit our plantation drives, blood camps, and scholar centers. Contact us at info@youthsakti.org to schedule a visit to an upcoming event.",
  },
  {
    q: "How are volunteers selected and trained?",
    a: "Volunteers register through our online portal and undergo a brief orientation covering safety protocols, campaign objectives, and code of conduct. Emergency contacts are collected for all field participants.",
  },
  {
    q: "What happens to surplus funds at the end of a campaign?",
    a: "Surplus funds are either redirected to the next active campaign in the same category or allocated to the Emergency Reserve Fund for disaster response. This is documented in our quarterly financial reports.",
  },
];

export default function TransparencyPage() {
  const [stats, setStats] = useState<AdminStatsResponse | null>(null);

  useEffect(() => {
    apiGetAdminStats().then((result) => {
      setStats(result);
    });
  }, []);

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

        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-900/10 border border-primary-900/15 text-primary-900 text-sm font-heading font-semibold mb-4">
            <Shield className="w-4 h-4 text-accent-500" />
            <span>100% Transparent Operations</span>
          </div>
          <h1 className="font-heading font-extrabold text-4xl sm:text-5xl text-primary-900 leading-tight mb-4">
            Our Commitment to{" "}
            <span className="handwritten-highlight inline-block font-handwritten text-accent-500 transform rotate-[-1deg] px-2 text-5xl sm:text-6xl">
              Transparency
            </span>
          </h1>
          <p className="font-sans text-lg text-foreground/80 max-w-2xl mx-auto leading-relaxed">
            Trust is earned through action, not words. At YSSF, we open our books, publish our impact metrics,
            and invite public scrutiny of every operation we undertake.
          </p>
        </motion.div>

        {/* Real-Time Platform Stats */}
        {stats && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-16"
          >
            <div className="text-center mb-8">
              <h2 className="font-heading font-extrabold text-2xl text-primary-900 mb-2">Live Platform Numbers</h2>
              <p className="font-sans text-foreground/70">Real-time aggregate data from our platform, updated automatically.</p>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="yssf-card p-6 bg-white border-primary-200/40 text-center">
                <div className="inline-flex p-2 rounded-full bg-primary-900/10 text-primary-900 mb-2">
                  <Users className="w-5 h-5" />
                </div>
                <p className="font-heading font-extrabold text-3xl text-primary-900">{stats.totalUsers.toLocaleString("en-IN")}</p>
                <p className="font-sans text-xs text-foreground/60 mt-1">Registered Users</p>
              </div>
              <div className="yssf-card p-6 bg-white border-primary-200/40 text-center">
                <div className="inline-flex p-2 rounded-full bg-alert-500/10 text-alert-500 mb-2">
                  <Heart className="w-5 h-5" />
                </div>
                <p className="font-heading font-extrabold text-3xl text-primary-900">{formatCurrency(stats.totalDonations)}</p>
                <p className="font-sans text-xs text-foreground/60 mt-1">Total Donations Received</p>
              </div>
              <div className="yssf-card p-6 bg-white border-primary-200/40 text-center">
                <div className="inline-flex p-2 rounded-full bg-accent-500/10 text-accent-600 mb-2">
                  <Leaf className="w-5 h-5" />
                </div>
                <p className="font-heading font-extrabold text-3xl text-primary-900">{stats.activeCampaigns}</p>
                <p className="font-sans text-xs text-foreground/60 mt-1">Active Campaigns</p>
              </div>
              <div className="yssf-card p-6 bg-white border-primary-200/40 text-center">
                <div className="inline-flex p-2 rounded-full bg-primary-700/10 text-primary-700 mb-2">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <p className="font-heading font-extrabold text-3xl text-primary-900">{stats.recentDonations.length}</p>
                <p className="font-sans text-xs text-foreground/60 mt-1">Recent Donations</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Transparency Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {TRANSPARENCY_PILLARS.map((pillar, index) => {
            const IconComp = pillar.icon;
            return (
              <motion.div
                key={pillar.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="yssf-card p-8 bg-white border-primary-200/40"
              >
                <div className={`inline-flex p-3 rounded-full ${pillar.bg} ${pillar.color} mb-4`}>
                  <IconComp className="w-6 h-6" />
                </div>
                <h3 className="font-heading font-extrabold text-xl text-primary-900 mb-2">{pillar.title}</h3>
                <p className="font-sans text-sm text-foreground/80 leading-relaxed">{pillar.description}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Transparency Dashboard Links */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="yssf-card p-8 bg-primary-900 text-white border-primary-400 mb-16"
        >
          <h2 className="font-heading font-extrabold text-2xl mb-2">Explore Our Transparency Dashboards</h2>
          <p className="font-sans text-primary-200 mb-8 max-w-xl">
            Dive deep into every aspect of YSSF operations. Each dashboard provides real-time data and downloadable reports.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              href="/dashboard/donors"
              className="group p-5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/10 hover:border-white/30 transition-all"
            >
              <Heart className="w-6 h-6 text-accent-500 mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="font-heading font-bold text-sm mb-1">Donor Contributions</h3>
              <p className="font-sans text-xs text-primary-200">View all donor records and fund allocation</p>
            </Link>
            <Link
              href="/dashboard/campaigns"
              className="group p-5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/10 hover:border-white/30 transition-all"
            >
              <Leaf className="w-6 h-6 text-accent-500 mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="font-heading font-bold text-sm mb-1">Campaign Progress</h3>
              <p className="font-sans text-xs text-primary-200">Track milestones and campaign spending</p>
            </Link>
            <Link
              href="/dashboard/impact"
              className="group p-5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/10 hover:border-white/30 transition-all"
            >
              <Globe className="w-6 h-6 text-accent-500 mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="font-heading font-bold text-sm mb-1">Impact Metrics</h3>
              <p className="font-sans text-xs text-primary-200">Verified metrics by region and year</p>
            </Link>
            <Link
              href="/dashboard/financials"
              className="group p-5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/10 hover:border-white/30 transition-all"
            >
              <FileText className="w-6 h-6 text-accent-500 mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="font-heading font-bold text-sm mb-1">Financial Ledger</h3>
              <p className="font-sans text-xs text-primary-200">Open books, audit reports, compliance docs</p>
            </Link>
          </div>
        </motion.div>

        {/* Governing Committee */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <div className="text-center mb-10">
            <h2 className="font-heading font-extrabold text-3xl text-primary-900 mb-2">Governing Committee</h2>
            <p className="font-sans text-foreground/70 max-w-xl mx-auto">
              Our operations are led by a diverse team of dedicated professionals, all volunteering their time and expertise for social good.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {COMMITTEE_MEMBERS.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                className="yssf-card p-6 bg-white border-primary-200/40 flex items-center gap-4"
              >
                <div className={`w-14 h-14 rounded-full ${member.color} flex items-center justify-center text-white font-heading font-bold text-lg flex-shrink-0`}>
                  {member.initials}
                </div>
                <div>
                  <h3 className="font-heading font-bold text-sm text-primary-900">{member.name}</h3>
                  <p className="font-sans text-xs text-foreground/60">{member.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Data Protection Notice */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="yssf-card p-8 bg-surface-100/30 border-primary-200/40 mb-16"
        >
          <div className="flex items-start gap-4">
            <Lock className="w-8 h-8 text-primary-900 flex-shrink-0 mt-1" />
            <div>
              <h2 className="font-heading font-extrabold text-xl text-primary-900 mb-3">Data Protection & Privacy</h2>
              <div className="space-y-3 font-sans text-sm text-foreground/80 leading-relaxed">
                <p>
                  YSSF collects only the minimum personal data necessary to coordinate volunteer activities, issue tax receipts, and communicate campaign updates. We never sell or share personal information with third parties for marketing purposes.
                </p>
                <p>
                  <strong className="font-heading font-semibold text-primary-900">Donor Privacy:</strong> Individual donation amounts and PAN numbers are never published. Only aggregate totals are displayed on our public dashboards.
                </p>
                <p>
                  <strong className="font-heading font-semibold text-primary-900">Volunteer Data:</strong> Emergency contact information is collected solely for field safety and is accessible only to authorized campaign coordinators.
                </p>
                <p>
                  <strong className="font-heading font-semibold text-primary-900">Data Retention:</strong> Financial records are retained for the legally mandated period. Personal data can be deleted upon written request to <a href="mailto:privacy@youthsakti.org" className="underline font-semibold text-primary-900">privacy@youthsakti.org</a>.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <div className="text-center mb-10">
            <h2 className="font-heading font-extrabold text-3xl text-primary-900 mb-2">Frequently Asked Questions</h2>
            <p className="font-sans text-foreground/70">Common questions about our operations, funds, and accountability.</p>
          </div>

          <div className="space-y-4 max-w-3xl mx-auto">
            {FAQ_ITEMS.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                className="yssf-card p-6 bg-white border-primary-200/40"
              >
                <h3 className="font-heading font-bold text-base text-primary-900 mb-3 flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-accent-500 flex-shrink-0 mt-0.5" />
                  {item.q}
                </h3>
                <p className="font-sans text-sm text-foreground/80 leading-relaxed ml-7">{item.a}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Contact Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="yssf-card p-8 bg-white border-primary-200/40 mb-12"
        >
          <div className="text-center mb-8">
            <h2 className="font-heading font-extrabold text-2xl text-primary-900 mb-2">Questions About Our Operations?</h2>
            <p className="font-sans text-foreground/70">
              We welcome inquiries from donors, media, regulatory bodies, and the general public.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-5 rounded-2xl bg-surface-100/30 border border-primary-200/20">
              <Mail className="w-6 h-6 text-primary-900 mx-auto mb-2" />
              <h3 className="font-heading font-bold text-sm text-primary-900">Email</h3>
              <a href="mailto:info@youthsakti.org" className="font-sans text-sm text-primary-700 hover:underline">
                info@youthsakti.org
              </a>
            </div>
            <div className="text-center p-5 rounded-2xl bg-surface-100/30 border border-primary-200/20">
              <Phone className="w-6 h-6 text-primary-900 mx-auto mb-2" />
              <h3 className="font-heading font-bold text-sm text-primary-900">Phone</h3>
              <p className="font-sans text-sm text-primary-700">+91 98765 43210</p>
            </div>
            <div className="text-center p-5 rounded-2xl bg-surface-100/30 border border-primary-200/20">
              <MapPin className="w-6 h-6 text-primary-900 mx-auto mb-2" />
              <h3 className="font-heading font-bold text-sm text-primary-900">Office</h3>
              <p className="font-sans text-sm text-primary-700">Block 4, Sector V, Salt Lake, Kolkata 700091</p>
            </div>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Link
            href="/#donate"
            className="inline-flex items-center gap-2 px-8 py-4 bg-accent-500 hover:bg-accent-600 text-primary-900 font-heading font-extrabold rounded-2xl transition-all shadow-md shadow-accent-500/25 hover:shadow-lg hover:-translate-y-0.5 border-2 border-primary-900/10"
          >
            Donate With Full Confidence
            <ArrowUpRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
