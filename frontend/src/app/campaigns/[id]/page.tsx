"use client";

import { use, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { ArrowLeft, Heart, Send, CheckCircle2, Loader2, Users } from "lucide-react";
import { apiCreateDonation, apiGetCampaignBySlug } from "@/lib/api";

export default function CampaignDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  const [campaign, setCampaign] = useState<Awaited<ReturnType<typeof apiGetCampaignBySlug>> | null>(null);
  const [loadingCampaign, setLoadingCampaign] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [donateAmount, setDonateAmount] = useState("1000");
  const [customAmount, setCustomAmount] = useState("");
  const [donorName, setDonorName] = useState("");
  const [donorEmail, setDonorEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [donationError, setDonationError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const fetchCampaign = async () => {
      setLoadingCampaign(true);
      setError(null);
      try {
        const data = await apiGetCampaignBySlug(id);
        if (!cancelled) setCampaign(data);
      } catch {
        if (!cancelled) setError("Campaign not found");
      } finally {
        if (!cancelled) setLoadingCampaign(false);
      }
    };
    fetchCampaign();
    return () => { cancelled = true; };
  }, [id]);

  if (loadingCampaign) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <Loader2 className="w-10 h-10 text-primary-900 mx-auto mb-4 animate-spin" />
        <p className="font-heading font-bold text-sm text-primary-900/60">Loading campaign...</p>
      </div>
    );
  }

  if (error || !campaign) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <h1 className="font-heading font-extrabold text-3xl text-primary-900 mb-4">Campaign Not Found</h1>
        <p className="font-sans text-foreground/80 mb-8">This campaign may have been removed or the link is incorrect.</p>
        <Link href="/campaigns" className="px-6 py-3 bg-primary-900 hover:bg-primary-800 text-white font-heading font-bold text-sm rounded-xl transition-all shadow-md">Browse Campaigns</Link>
      </div>
    );
  }

  const progressPercent = Math.min(Math.round((campaign.raised / campaign.goal) * 100), 100);
  const formatCurrency = (val: number) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(val);
  const finalAmount = Number(donateAmount || customAmount || "0");

  const handleDonate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!donorName || !donorEmail || finalAmount <= 0) return;
    setLoading(true);
    setDonationError(null);
    try {
      const donation = await apiCreateDonation({
        amount: finalAmount,
        donorName,
        donorEmail,
        campaignId: campaign.id,
      });
      setCampaign((current) => current ? {
        ...current,
        raised: current.raised + donation.amount,
        donations: [donation, ...(current.donations || [])],
      } : current);
      setLoading(false);
      setSubmitted(true);
      confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 }, colors: ["#0B5D3B", "#8FD694", "#F4B400"] });
    } catch (err) {
      setDonationError(err instanceof Error ? err.message : "Failed to process donation");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-surface-100/40 via-white to-surface-100/20">
      {/* Hero */}
      <section className="relative h-72 sm:h-96 w-full bg-primary-900/10">
        <Image src={campaign.imageSrc} alt={campaign.title} fill priority className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary-900/80 via-primary-900/30 to-transparent" />
        <div className="absolute bottom-8 left-0 right-0">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link href="/campaigns" className="inline-flex items-center gap-2 text-white/80 font-heading font-semibold text-sm hover:text-white mb-4">
              <ArrowLeft className="w-4 h-4" /> Back to Campaigns
            </Link>
            <span className="inline-block px-3 py-1 rounded-full text-xs font-heading font-bold bg-white/90 text-primary-900 mb-3">{campaign.category}</span>
            <h1 className="font-heading font-extrabold text-3xl sm:text-4xl text-white leading-tight">{campaign.title}</h1>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Main Content */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-8 space-y-10">
              {/* Progress */}
              <div className="yssf-card p-6 border border-primary-200/30 space-y-4">
                <div className="flex justify-between text-sm font-heading font-semibold text-primary-900">
                  <span>{formatCurrency(campaign.raised)} raised</span>
                  <span>Goal: {formatCurrency(campaign.goal)}</span>
                </div>
                <div className="w-full h-4 bg-surface-100 rounded-full overflow-hidden border border-primary-200/20">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${progressPercent}%` }} transition={{ duration: 1, ease: "easeOut" }} className={`h-full ${campaign.progressColor} rounded-full`} />
                </div>
                <p className="font-sans text-xs text-foreground/60">{progressPercent}% funded</p>
              </div>

              {/* Description */}
              <div className="space-y-4">
                <h2 className="font-heading font-extrabold text-2xl text-primary-900">About This Campaign</h2>
                <p className="font-sans text-base text-foreground/80 leading-relaxed">{campaign.fullDescription}</p>
              </div>

              {/* Donor List */}
              <div className="space-y-4">
                <h2 className="font-heading font-extrabold text-xl text-primary-900 flex items-center gap-2"><Users className="w-5 h-5" /> Recent Donors</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {(campaign.donations || []).slice(0, 10).map((d) => (
                    <div key={d.id} className="flex items-center justify-between p-3 rounded-xl border border-primary-200/30 bg-white">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-surface-100 flex items-center justify-center text-primary-900 font-heading font-bold text-xs">{d.donorName.charAt(0)}</div>
                        <span className="font-heading font-semibold text-sm text-primary-900">{d.donorName}</span>
                      </div>
                      <div className="text-right">
                        <p className="font-heading font-bold text-sm text-primary-900">{formatCurrency(d.amount)}</p>
                        <p className="font-sans text-[10px] text-foreground/50">{new Date(d.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</p>
                      </div>
                    </div>
                  ))}
                  {(campaign.donations || []).length === 0 && (
                    <div className="p-4 rounded-xl border border-primary-200/30 bg-white text-center font-sans text-sm text-foreground/60">
                      No donations yet. Be the first supporter for this campaign.
                    </div>
                  )}
                </div>
              </div>

            </motion.div>

            {/* Donation Sidebar */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="lg:col-span-4">
              <div className="yssf-card p-6 border border-primary-200/40 sticky top-28 space-y-5">
                {submitted ? (
                  <div className="text-center space-y-4 py-6">
                    <div className="w-16 h-16 bg-accent-500 rounded-full flex items-center justify-center text-primary-900 mx-auto border-4 border-primary-900">
                      <CheckCircle2 className="w-10 h-10" />
                    </div>
                    <h3 className="font-heading font-extrabold text-xl text-primary-900">Thank You!</h3>
                    <p className="font-sans text-sm text-foreground/75">Your contribution of <strong className="text-primary-900">₹{finalAmount}</strong> has been received. An 80G receipt will be sent to <strong className="text-primary-900">{donorEmail}</strong>.</p>
                  </div>
                ) : (
                  <form onSubmit={handleDonate} className="space-y-4">
                    <h3 className="font-heading font-extrabold text-lg text-primary-900 flex items-center gap-2"><Heart className="w-5 h-5 text-alert-500 fill-alert-500" /> Donate Now</h3>
                    {donationError && (
                      <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 font-sans text-xs">{donationError}</div>
                    )}

                    <div className="grid grid-cols-4 gap-2">
                      {["500", "1000", "2500", "5000"].map((amt) => (
                        <button key={amt} type="button" onClick={() => { setDonateAmount(amt); setCustomAmount(""); }} className={`py-2 rounded-xl text-xs font-heading font-bold transition-all border cursor-pointer ${donateAmount === amt ? "bg-primary-900 border-primary-900 text-white" : "bg-surface-100/50 border-primary-200 text-primary-900 hover:bg-surface-100"}`}>₹{amt}</button>
                      ))}
                    </div>

                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 font-sans font-semibold text-sm text-foreground/60">₹</span>
                      <input type="number" value={customAmount} onChange={(e) => { setCustomAmount(e.target.value); setDonateAmount(""); }} placeholder="Custom amount" className="w-full pl-8 pr-4 py-3 rounded-xl border border-primary-200 font-sans text-sm focus:outline-none focus:ring-2 focus:ring-accent-500" />
                    </div>

                    <input type="text" required value={donorName} onChange={(e) => setDonorName(e.target.value)} placeholder="Full Name" className="w-full px-4 py-3 rounded-xl border border-primary-200 font-sans text-sm focus:outline-none focus:ring-2 focus:ring-accent-500 text-foreground" />
                    <input type="email" required value={donorEmail} onChange={(e) => setDonorEmail(e.target.value)} placeholder="Email Address" className="w-full px-4 py-3 rounded-xl border border-primary-200 font-sans text-sm focus:outline-none focus:ring-2 focus:ring-accent-500 text-foreground" />

                    <button type="submit" disabled={loading || finalAmount <= 0} className="w-full py-4 bg-accent-500 hover:bg-accent-600 disabled:bg-accent-500/50 text-primary-900 font-heading font-bold text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer border-2 border-primary-900/10">
                      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><span>Contribute ₹{finalAmount}</span><Send className="w-4 h-4" /></>}
                    </button>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
