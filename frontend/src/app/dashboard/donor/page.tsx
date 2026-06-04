"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Heart,
  TrendingUp,
  Receipt,
  Calendar,
  Download,
  ArrowUpRight,
  X,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";
import {
  apiGetDashboardStats,
  apiGetDonationHistory,
  apiUpdateProfile,
  type DashboardStatsResponse,
} from "@/lib/api";

interface DonationWithCampaign {
  id: string;
  amount: number;
  createdAt: string | Date;
  campaign?: { id: string; title: string; goal?: number; raised?: number; category?: string; status?: string } | null;
}

const PREDEFINED_CAUSES = ["Education", "Environment", "Health", "Youth Empowerment", "Women Welfare", "Disaster Relief"];

function formatCurrency(val: number) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(val);
}

function formatDate(date: string | Date) {
  return new Date(date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

function DonorSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-surface-100/40 via-white to-surface-100/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="h-5 w-28 bg-surface-100 rounded animate-pulse mb-8" />
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-surface-100 animate-pulse" />
            <div className="h-4 w-32 bg-surface-100 rounded animate-pulse" />
          </div>
          <div className="h-10 w-72 bg-surface-100 rounded animate-pulse mb-2" />
          <div className="h-5 w-80 bg-surface-100 rounded animate-pulse" />
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="yssf-card p-5 bg-white border-primary-200/40 text-center">
              <div className="w-5 h-5 bg-surface-100 mx-auto mb-2 animate-pulse" />
              <div className="h-8 w-20 bg-surface-100 rounded mx-auto animate-pulse" />
              <div className="h-4 w-24 bg-surface-100 rounded mx-auto mt-2 animate-pulse" />
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-7">
            <div className="h-6 w-36 bg-surface-100 rounded animate-pulse mb-4" />
            <div className="h-64 bg-surface-100/50 rounded-2xl animate-pulse" />
          </div>
          <div className="lg:col-span-5">
            <div className="h-6 w-36 bg-surface-100 rounded animate-pulse mb-4" />
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-surface-100/50 rounded-2xl animate-pulse mb-4" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DonorDashboardPage() {
  const router = useRouter();
  const [dashData, setDashData] = useState<DashboardStatsResponse | null>(null);
  const [donations, setDonations] = useState<DonationWithCampaign[]>([]);
  const [loading, setLoading] = useState(true);

  // Profile Edit States
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [panTaxId, setPanTaxId] = useState("");
  const [address, setAddress] = useState("");
  const [selectedCauses, setSelectedCauses] = useState<string[]>([]);
  const [editLoading, setEditLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    Promise.all([apiGetDashboardStats(), apiGetDonationHistory()])
      .then(([stats, history]) => {
        if (!stats) {
          router.push("/login");
          return;
        }
        setDashData(stats);
        setDonations(history);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading donor dashboard stats:", err);
        router.push("/login?error=load_failed");
      });
  }, [router]);

  useEffect(() => {
    if (dashData) {
      setName(dashData.user.name || "");
      setPhone(dashData.user.phone || "");
      setPanTaxId(dashData.user.panTaxId || "");
      setAddress(dashData.user.address || "");
      const causes = dashData.user.preferredCauses
        ? dashData.user.preferredCauses.split(",").map((c) => c.trim()).filter(Boolean)
        : [];
      setSelectedCauses(causes);
    }
  }, [dashData]);

  const toggleCause = (cause: string) => {
    if (selectedCauses.includes(cause)) {
      setSelectedCauses(selectedCauses.filter((c) => c !== cause));
    } else {
      setSelectedCauses([...selectedCauses, cause]);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setEditLoading(true);
    try {
      await apiUpdateProfile({
        name,
        phone,
        panTaxId,
        address,
        preferredCauses: selectedCauses.join(", "),
      });
      showToast("Profile updated successfully!");
      setIsEditModalOpen(false);
      const updatedStats = await apiGetDashboardStats();
      setDashData(updatedStats);
    } catch (err) {
      console.error("Failed to update profile:", err);
      showToast(err instanceof Error ? err.message : "Failed to update profile", "error");
    } finally {
      setEditLoading(false);
    }
  };

  const handleDownloadCertificate = () => {
    if (!dashData) return;
    const { user, stats } = dashData;
    const pan = user.panTaxId || "Not Provided";
    const totalStr = formatCurrency(stats.totalDonated);
    const dateStr = new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" });
    
    const content = `========================================================================
                      YOUTH SAKTI SOCIAL FOUNDATION (YSSF)
                      80G TAX EXEMPTION CERTIFICATE / RECEIPT
========================================================================

Receipt Date: ${dateStr}
Certificate No: YSSF-80G-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}

DONOR INFORMATION
-----------------
Donor Name: ${user.name || "Friend"}
Email Address: ${user.email}
Phone Number: ${user.phone || "Not Provided"}
Permanent Account Number (PAN): ${pan}
Address: ${user.address || "Not Provided"}

EXEMPTION DETAILS
-----------------
Financial Year: ${new Date().getMonth() >= 3 ? `${new Date().getFullYear()}-${new Date().getFullYear() + 1}` : `${new Date().getFullYear() - 1}-${new Date().getFullYear()}`}
Section: Section 80G of the Income Tax Act, 1961
Total Amount Contributed: ${totalStr}
Exemption Rate: 50% eligible for exemption under Section 80G

Summary of Donations:
${donations.map((d, index) => `${index + 1}. Date: ${formatDate(d.createdAt)} | Campaign: ${d.campaign?.title || "General Donation"} | Amount: ${formatCurrency(d.amount)}`).join("\n")}

------------------------------------------------------------------------
This is a computer-generated certificate. No physical signature is required.
Thank you for your generous support of Youth Sakti Social Foundation!
Youth Energy for Social Impact.
========================================================================`;

    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `YSSF_80G_Tax_Certificate_${user.name?.replace(/\s+/g, "_") || "Donor"}.txt`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("80G certificate downloaded successfully!");
  };

  const handleDownloadSingleReceipt = (donation: DonationWithCampaign) => {
    if (!dashData) return;
    const { user } = dashData;
    const amountStr = formatCurrency(donation.amount);
    const dateStr = formatDate(donation.createdAt);
    const receiptNo = `YSSF-REC-${donation.id.slice(-6).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const pan = user.panTaxId || "Not Provided";

    const content = `========================================================================
                      YOUTH SAKTI SOCIAL FOUNDATION (YSSF)
                          OFFICIAL DONATION RECEIPT
========================================================================

Receipt Number: ${receiptNo}
Date of Receipt: ${dateStr}

DONOR DETAILS
-------------
Donor Name: ${user.name || "Friend"}
Donor Email: ${user.email}
Phone Number: ${user.phone || "Not Provided"}
Permanent Account Number (PAN): ${pan}
Address: ${user.address || "Not Provided"}

DONATION DETAILS
----------------
Campaign Supported: ${donation.campaign?.title || "General Donation"}
Amount Received: ${amountStr}
Payment Reference: Successful (Simulated)
80G Exemption: Eligible for 50% deduction under Section 80G of IT Act, 1961

Thank you for supporting Youth Sakti Social Foundation!
This is a computer-generated receipt and requires no physical signature.
========================================================================`;

    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `YSSF_Receipt_${receiptNo}.txt`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`Receipt ${receiptNo} downloaded!`);
  };

  if (loading) return <DonorSkeleton />;
  if (!dashData) return null;

  const DONOR_STATS = [
    { label: "Total Donated", value: formatCurrency(dashData.stats.totalDonated), icon: Heart, color: "text-alert-500", bg: "bg-alert-500/10" },
    { label: "Campaigns Supported", value: String(new Set(donations.filter((d) => d.campaign).map((d) => d.campaign!.id)).size), icon: TrendingUp, color: "text-primary-900", bg: "bg-primary-900/10" },
    { label: "Total Donations", value: String(donations.length), icon: Receipt, color: "text-accent-600", bg: "bg-accent-500/10" },
    { label: "Impact Score", value: String(dashData.stats.impactScore), icon: Calendar, color: "text-primary-700", bg: "bg-primary-700/10" },
  ];

  const activeCampaigns = Array.from(
    donations.reduce((map, d) => {
      if (d.campaign) {
        const existing = map.get(d.campaign.id);
        if (existing) {
          existing.raised += d.amount;
        } else {
          map.set(d.campaign.id, { ...d.campaign, raised: d.amount });
        }
      }
      return map;
    }, new Map<string, { id: string; title: string; goal?: number; raised: number; status?: string }>())
  ).map(([, v]) => v);

  const categoryBreakdown = donations.reduce((acc, d) => {
    const category = d.campaign?.category || "General";
    acc[category] = (acc[category] || 0) + d.amount;
    return acc;
  }, {} as Record<string, number>);

  const totalDonated = dashData.stats.totalDonated;
  const campaignColors = ["bg-primary-900", "bg-alert-500", "bg-accent-500", "bg-primary-700", "bg-warning-500"];

  return (
    <div className="min-h-screen bg-gradient-to-b from-surface-100/40 via-white to-surface-100/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link href="/" className="inline-flex items-center gap-2 text-primary-900 font-heading font-semibold text-sm hover:underline mb-8">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4"
        >
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-xl bg-alert-500/10 text-alert-500">
                <Heart className="w-6 h-6" />
              </div>
              <span className="font-display font-semibold text-primary-700 uppercase tracking-widest text-sm">Donor Dashboard</span>
            </div>
            <h1 className="font-heading font-extrabold text-4xl text-primary-900 leading-tight">
              Welcome, <span className="handwritten-highlight inline-block font-handwritten text-accent-500">{dashData.user.name || "Donor"}</span>
            </h1>
            <p className="font-sans text-foreground/80 mt-2">Track your donations, download tax receipts, and see your impact.</p>
          </div>
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="px-5 py-2.5 bg-primary-900 hover:bg-primary-850 text-white font-heading font-semibold text-sm rounded-xl transition-all shadow-md shadow-primary-900/10 hover:shadow-lg hover:-translate-y-0.5 cursor-pointer self-start sm:self-auto"
          >
            Edit Profile
          </button>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {DONOR_STATS.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="yssf-card p-5 bg-white border-primary-200/40 text-center"
              >
                <div className={`inline-flex p-2 rounded-full ${stat.bg} ${stat.color} mb-2`}>
                  <Icon className="w-5 h-5" />
                </div>
                <p className="font-heading font-extrabold text-2xl text-primary-900">{stat.value}</p>
                <p className="font-sans text-xs text-foreground/60 mt-1">{stat.label}</p>
              </motion.div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Donation History */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="lg:col-span-7">
            <h2 className="font-heading font-extrabold text-xl text-primary-900 mb-4">Donation History</h2>
            <div className="yssf-card overflow-hidden bg-white border-primary-200/40">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-primary-100">
                      <th className="text-left p-4 font-heading font-bold text-xs text-primary-900/70 uppercase tracking-wider">Date</th>
                      <th className="text-left p-4 font-heading font-bold text-xs text-primary-900/70 uppercase tracking-wider">Campaign</th>
                      <th className="text-right p-4 font-heading font-bold text-xs text-primary-900/70 uppercase tracking-wider">Amount</th>
                      <th className="text-center p-4 font-heading font-bold text-xs text-primary-900/70 uppercase tracking-wider">Receipt</th>
                    </tr>
                  </thead>
                  <tbody>
                    {donations.length > 0 ? donations.map((donation, i) => (
                      <tr key={donation.id || i} className="border-b border-primary-100/50 last:border-0">
                        <td className="p-4 font-sans text-sm text-foreground/80">{formatDate(donation.createdAt)}</td>
                        <td className="p-4 font-heading font-semibold text-sm text-primary-900">{donation.campaign?.title || "General Donation"}</td>
                        <td className="p-4 text-right font-heading font-bold text-sm text-primary-900">{formatCurrency(donation.amount)}</td>
                        <td className="p-4 text-center">
                          <button
                            onClick={() => handleDownloadSingleReceipt(donation)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary-900/10 hover:bg-primary-900 hover:text-white text-primary-900 text-xs font-heading font-semibold transition-all cursor-pointer border border-transparent hover:border-primary-850"
                            title="Download Donation Receipt"
                          >
                            <Download className="w-3.5 h-3.5" /> Download
                          </button>
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan={4} className="p-6 text-center font-sans text-sm text-foreground/60">No donations yet.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>

          {/* Active Campaigns + Tax Certificate */}
          <div className="lg:col-span-5 space-y-8">
            {/* Donor Info Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="yssf-card p-6 bg-white border-primary-200/30 shadow-sm"
            >
              <h2 className="font-heading font-extrabold text-xl text-primary-900 mb-4">Donor Profile</h2>
              <div className="space-y-3.5">
                <div className="flex justify-between border-b border-primary-100/50 pb-2">
                  <span className="text-xs text-foreground/60 font-sans">PAN / Tax ID</span>
                  <span className="text-xs font-heading font-bold text-primary-900">{dashData.user.panTaxId || "Not Provided"}</span>
                </div>
                <div className="flex justify-between border-b border-primary-100/50 pb-2">
                  <span className="text-xs text-foreground/60 font-sans">Phone</span>
                  <span className="text-xs font-heading font-bold text-primary-900">{dashData.user.phone || "Not Provided"}</span>
                </div>
                <div className="flex justify-between border-b border-primary-100/50 pb-2">
                  <span className="text-xs text-foreground/60 font-sans">Preferred Causes</span>
                  <span className="text-xs font-heading font-bold text-primary-900 max-w-[200px] truncate" title={dashData.user.preferredCauses || ""}>
                    {dashData.user.preferredCauses || "Not Provided"}
                  </span>
                </div>
                <div className="flex justify-between pb-1">
                  <span className="text-xs text-foreground/60 font-sans">Address</span>
                  <span className="text-xs font-heading font-bold text-primary-900 max-w-[200px] truncate" title={dashData.user.address || ""}>
                    {dashData.user.address || "Not Provided"}
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Category Breakdown */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="yssf-card p-6 bg-white border-primary-200/30 shadow-sm"
            >
              <h2 className="font-heading font-extrabold text-xl text-primary-900 mb-2">Category Distribution</h2>
              <p className="font-sans text-xs text-foreground/60 mb-4">See how your donations are split across cause categories.</p>
              {totalDonated > 0 ? (
                <div className="space-y-4">
                  {/* Stacked Progress Bar */}
                  <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden flex">
                    {Object.entries(categoryBreakdown).map(([category, amount], idx) => {
                      const percentage = Math.round((amount / totalDonated) * 100);
                      if (percentage === 0) return null;
                      return (
                        <div
                          key={category}
                          style={{ width: `${percentage}%` }}
                          className={`${campaignColors[idx % campaignColors.length]} h-full transition-all`}
                          title={`${category}: ${percentage}%`}
                        />
                      );
                    })}
                  </div>
                  {/* Legend Grid */}
                  <div className="grid grid-cols-2 gap-3">
                    {Object.entries(categoryBreakdown).map(([category, amount], idx) => {
                      const percentage = Math.round((amount / totalDonated) * 100);
                      return (
                        <div key={category} className="flex items-center gap-2">
                          <span className={`w-2.5 h-2.5 rounded-full ${campaignColors[idx % campaignColors.length]}`} />
                          <span className="font-heading font-bold text-xs text-primary-900">{category}</span>
                          <span className="font-sans text-[10px] text-foreground/50">({percentage}%)</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <p className="font-sans text-xs text-foreground/50 text-center py-4">No donation distribution data available.</p>
              )}
            </motion.div>

            {/* Tax Exemption Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="yssf-card p-6 bg-primary-900 text-white"
            >
              <Receipt className="w-8 h-8 text-accent-500 mb-3" />
              <h3 className="font-heading font-extrabold text-lg mb-2">80G Tax Exemption</h3>
              <p className="font-sans text-sm text-primary-200 mb-4">
                Download your tax exemption certificate for the current financial year. YSSF is registered under Section 80G.
              </p>
              <button
                onClick={handleDownloadCertificate}
                className="w-full py-3 bg-accent-500 hover:bg-accent-600 text-primary-900 font-heading font-bold text-sm rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Download className="w-4 h-4" /> Download Certificate
              </button>
            </motion.div>

            {/* Campaigns Supported */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
              <h2 className="font-heading font-extrabold text-xl text-primary-900 mb-4">Campaigns Supported</h2>
              {activeCampaigns.length > 0 ? (
                <div className="space-y-4">
                  {activeCampaigns.map((campaign, i) => {
                    const percent = campaign.goal ? Math.round((campaign.raised / campaign.goal) * 100) : 0;
                    return (
                      <div key={campaign.id} className="yssf-card p-4 bg-white border-primary-200/30">
                        <div className="flex justify-between items-center mb-2">
                          <h3 className="font-heading font-bold text-sm text-primary-900">{campaign.title}</h3>
                          {campaign.goal && campaign.goal > 0 && <span className="font-heading font-bold text-xs text-primary-900/70">{percent}%</span>}
                        </div>
                        {campaign.goal && campaign.goal > 0 && (
                          <>
                            <div className="w-full h-2.5 bg-surface-100 rounded-full overflow-hidden mb-1">
                              <motion.div
                                initial={{ width: 0 }}
                                whileInView={{ width: `${percent}%` }}
                                viewport={{ once: true }}
                                transition={{ duration: 1 }}
                                className={`h-full ${campaignColors[i % campaignColors.length]} rounded-full`}
                              />
                            </div>
                            <p className="font-sans text-[10px] text-foreground/50">{formatCurrency(campaign.raised)} of {formatCurrency(campaign.goal)}</p>
                          </>
                        )}
                        {(!campaign.goal || campaign.goal === 0) && (
                          <p className="font-sans text-xs text-foreground/60">Your contribution: {formatCurrency(campaign.raised)}</p>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="p-6 rounded-2xl bg-white border border-primary-200/30 text-center">
                  <p className="font-sans text-sm text-foreground/60">No campaign donations yet.</p>
                </div>
              )}
            </motion.div>

            {/* Make a Donation CTA */}
            <Link href="/campaigns" className="flex items-center justify-between p-5 rounded-2xl bg-accent-500/10 border-2 border-accent-500/30 hover:border-accent-500 transition-all group">
              <div className="flex items-center gap-3">
                <Heart className="w-6 h-6 text-accent-600" />
                <div>
                  <p className="font-heading font-bold text-sm text-primary-900">Make Another Donation</p>
                  <p className="font-sans text-xs text-foreground/60">Browse active campaigns</p>
                </div>
              </div>
              <ArrowUpRight className="w-5 h-5 text-primary-900/40 group-hover:text-primary-900 transition-colors" />
            </Link>
          </div>
        </div>

        {/* Toast Notification */}
        <AnimatePresence>
          {toast && (
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.9 }}
              className={`fixed bottom-5 right-5 z-[100] flex items-center gap-2.5 px-5 py-3.5 rounded-2xl shadow-xl border text-sm font-heading font-semibold ${
                toast.type === "success"
                  ? "bg-slate-900 border-primary-400 text-white"
                  : "bg-red-950 border-red-800 text-red-200"
              }`}
            >
              {toast.type === "success" ? (
                <CheckCircle2 className="w-5 h-5 text-accent-500 shrink-0" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-alert-500 shrink-0" />
              )}
              <span>{toast.message}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Edit Profile Modal */}
        <AnimatePresence>
          {isEditModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsEditModalOpen(false)}
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
              />
              <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 15 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 15 }}
                className="relative bg-white rounded-3xl border border-slate-200 shadow-2xl p-8 max-w-lg w-full z-10 flex flex-col max-h-[90vh] overflow-y-auto"
              >
                <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
                  <h3 className="font-heading font-extrabold text-xl text-slate-900">Edit Donor Profile</h3>
                  <button
                    onClick={() => setIsEditModalOpen(false)}
                    className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-655 transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleUpdateProfile} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="font-heading font-bold text-[11px] text-slate-500 uppercase tracking-wider block">Full Name</label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-250 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-900/20 text-slate-900"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="font-heading font-bold text-[11px] text-slate-500 uppercase tracking-wider block">Phone Number</label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="e.g. +91 98765 43210"
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-250 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-900/20 text-slate-900"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-heading font-bold text-[11px] text-slate-500 uppercase tracking-wider block">PAN / Tax ID</label>
                    <input
                      type="text"
                      value={panTaxId}
                      onChange={(e) => setPanTaxId(e.target.value)}
                      placeholder="e.g. ABCDE1234F"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-250 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-900/20 text-slate-900"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-heading font-bold text-[11px] text-slate-500 uppercase tracking-wider block">Address</label>
                    <textarea
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Enter billing address for tax receipt..."
                      rows={2}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-250 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-900/20 text-slate-900 resize-none font-sans"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="font-heading font-bold text-[11px] text-slate-500 uppercase tracking-wider block">Preferred Causes</label>
                    <div className="flex flex-wrap gap-1.5">
                      {PREDEFINED_CAUSES.map((cause) => {
                        const isSelected = selectedCauses.includes(cause);
                        return (
                          <button
                            key={cause}
                            type="button"
                            onClick={() => toggleCause(cause)}
                            className={`px-3 py-1.5 rounded-full text-xs font-heading font-semibold border transition-all cursor-pointer ${
                              isSelected
                                ? "bg-primary-900 text-white border-primary-900 shadow-sm"
                                : "bg-slate-50 border-slate-200 text-slate-655 hover:bg-slate-100"
                            }`}
                          >
                            {cause}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setIsEditModalOpen(false)}
                      className="flex-1 py-3 border border-slate-200 hover:bg-slate-50 text-slate-700 font-heading font-bold text-xs rounded-xl cursor-pointer transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={editLoading}
                      className="flex-1 py-3 bg-primary-900 hover:bg-primary-850 disabled:bg-primary-900/50 text-white font-heading font-bold text-xs rounded-xl cursor-pointer transition-colors flex items-center justify-center gap-1.5"
                    >
                      {editLoading ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
