"use client";

import { use, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import {
  ArrowLeft,
  Heart,
  Send,
  CheckCircle2,
  Loader2,
  Users,
  ShieldCheck,
  Lock,
  CreditCard,
  Smartphone,
  X,
} from "lucide-react";
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

  // Simulated Checkout Modal States
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"upi" | "card" | "netbanking">("upi");
  const [upiId, setUpiId] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [selectedBank, setSelectedBank] = useState("SBI");
  const [checkoutStep, setCheckoutStep] = useState<"select" | "processing">("select");
  const [processingText, setProcessingText] = useState("Establishing secure payment tunnel...");

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

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!donorName || !donorEmail || finalAmount <= 0) return;
    setIsCheckoutOpen(true);
    setCheckoutStep("select");
  };

  const handleConfirmPayment = async () => {
    setCheckoutStep("processing");
    setLoading(true);

    const steps = [
      "Establishing secure payment tunnel...",
      "Authorizing token signature...",
      "Updating campaign totals in database...",
      "Finalizing receipt generation..."
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep++;
      if (currentStep < steps.length) {
        setProcessingText(steps[currentStep]);
      }
    }, 600);

    try {
      const donation = await apiCreateDonation({
        amount: finalAmount,
        donorName,
        donorEmail,
        campaignId: campaign.id,
      });

      clearInterval(interval);
      setCampaign((current) => current ? {
        ...current,
        raised: current.raised + donation.amount,
        donations: [donation, ...(current.donations || [])],
      } : current);

      setLoading(false);
      setIsCheckoutOpen(false);
      setSubmitted(true);
      confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 }, colors: ["#0B5D3B", "#8FD694", "#F4B400"] });
    } catch (err) {
      clearInterval(interval);
      setDonationError(err instanceof Error ? err.message : "Failed to process donation");
      setLoading(false);
      setIsCheckoutOpen(false);
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
              <div className="yssf-card p-6 border border-primary-200/40 sticky top-28 space-y-5 bg-white">
                {submitted ? (
                  <div className="text-center space-y-4 py-6">
                    <div className="w-16 h-16 bg-accent-500 rounded-full flex items-center justify-center text-primary-900 mx-auto border-4 border-primary-900">
                      <CheckCircle2 className="w-10 h-10" />
                    </div>
                    <h3 className="font-heading font-extrabold text-xl text-primary-900">Thank You!</h3>
                    <p className="font-sans text-sm text-foreground/75">
                      Your contribution of <strong className="text-primary-900">₹{finalAmount}</strong> has been received and verified. An 80G receipt will be sent to <strong className="text-primary-900">{donorEmail}</strong>.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleFormSubmit} className="space-y-4">
                    <h3 className="font-heading font-extrabold text-lg text-primary-900 flex items-center gap-2">
                      <Heart className="w-5 h-5 text-alert-500 fill-alert-500" /> Donate Now
                    </h3>
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
                      <input type="number" value={customAmount} onChange={(e) => { setCustomAmount(e.target.value); setDonateAmount(""); }} placeholder="Custom amount" className="w-full pl-8 pr-4 py-3 rounded-xl border border-primary-200 font-sans text-sm focus:outline-none focus:ring-2 focus:ring-accent-500 text-slate-900" />
                    </div>

                    <input type="text" required value={donorName} onChange={(e) => setDonorName(e.target.value)} placeholder="Full Name" className="w-full px-4 py-3 rounded-xl border border-primary-200 font-sans text-sm focus:outline-none focus:ring-2 focus:ring-accent-500 text-slate-900" />
                    <input type="email" required value={donorEmail} onChange={(e) => setDonorEmail(e.target.value)} placeholder="Email Address" className="w-full px-4 py-3 rounded-xl border border-primary-200 font-sans text-sm focus:outline-none focus:ring-2 focus:ring-accent-500 text-slate-900" />

                    <button type="submit" disabled={finalAmount <= 0} className="w-full py-4 bg-accent-500 hover:bg-accent-600 disabled:bg-accent-500/50 text-primary-900 font-heading font-bold text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer border-2 border-primary-900/10">
                      <span>Contribute ₹{finalAmount}</span>
                      <Send className="w-4 h-4" />
                    </button>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Simulated Checkout Modal */}
      <AnimatePresence>
        {isCheckoutOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCheckoutOpen(false)}
              className="absolute inset-0 bg-slate-900/70 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              className="relative bg-white rounded-3xl border border-slate-200 shadow-2xl p-7 max-w-md w-full z-10 flex flex-col overflow-hidden text-slate-900"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-5">
                <div className="flex items-center gap-2 text-primary-900">
                  <ShieldCheck className="w-6 h-6 text-accent-500" />
                  <div>
                    <h3 className="font-heading font-extrabold text-base leading-tight">YSSF Secure Checkout</h3>
                    <p className="font-sans text-[10px] text-slate-400 flex items-center gap-1"><Lock className="w-2.5 h-2.5" /> 256-bit SSL Encryption</p>
                  </div>
                </div>
                <button onClick={() => setIsCheckoutOpen(false)} className="p-1 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-655 cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {checkoutStep === "select" ? (
                <div className="space-y-4">
                  {/* Order Summary */}
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/60 flex justify-between items-center">
                    <div>
                      <p className="font-sans text-[10px] text-slate-400 uppercase tracking-wider">Campaign Donation</p>
                      <h4 className="font-heading font-bold text-sm text-primary-900 truncate max-w-[200px]">{campaign.title}</h4>
                    </div>
                    <div className="text-right">
                      <p className="font-heading font-extrabold text-lg text-primary-900">₹{finalAmount}</p>
                    </div>
                  </div>

                  {/* Payment Tabs */}
                  <div className="grid grid-cols-3 gap-2">
                    {(["upi", "card", "netbanking"] as const).map((method) => (
                      <button
                        key={method}
                        type="button"
                        onClick={() => setPaymentMethod(method)}
                        className={`py-2 px-1 rounded-xl text-center text-xs font-heading font-bold border transition-all cursor-pointer ${
                          paymentMethod === method
                            ? "bg-primary-900 border-primary-900 text-white shadow-sm"
                            : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                        }`}
                      >
                        {method === "upi" ? "UPI / QR" : method === "card" ? "Cards" : "NetBanking"}
                      </button>
                    ))}
                  </div>

                  {/* Payment Inputs */}
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/60 min-h-[140px] flex flex-col justify-center">
                    {paymentMethod === "upi" && (
                      <div className="space-y-3">
                        <label className="font-heading font-bold text-[10px] text-slate-500 uppercase tracking-wider block">Enter UPI ID</label>
                        <input
                          type="text"
                          required
                          value={upiId}
                          onChange={(e) => setUpiId(e.target.value)}
                          placeholder="e.g. mobile@upi"
                          className="w-full px-3.5 py-2.5 bg-white border border-slate-250 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-900/20 text-slate-900"
                        />
                        <div className="flex gap-2 justify-center pt-1.5 opacity-60">
                          <span className="text-[10px] font-sans bg-slate-200 px-2 py-0.5 rounded">Google Pay</span>
                          <span className="text-[10px] font-sans bg-slate-200 px-2 py-0.5 rounded">PhonePe</span>
                          <span className="text-[10px] font-sans bg-slate-200 px-2 py-0.5 rounded">BHIM</span>
                        </div>
                      </div>
                    )}

                    {paymentMethod === "card" && (
                      <div className="space-y-3">
                        <div>
                          <label className="font-heading font-bold text-[10px] text-slate-500 uppercase tracking-wider block mb-1">Card Number</label>
                          <input
                            type="text"
                            required
                            maxLength={19}
                            value={cardNumber}
                            onChange={(e) => setCardNumber(e.target.value)}
                            placeholder="4111 2222 3333 4444"
                            className="w-full px-3.5 py-2 bg-white border border-slate-250 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-900/20 text-slate-900"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="font-heading font-bold text-[10px] text-slate-500 uppercase tracking-wider block mb-1">Expiry Date</label>
                            <input
                              type="text"
                              required
                              placeholder="MM/YY"
                              maxLength={5}
                              value={cardExpiry}
                              onChange={(e) => setCardExpiry(e.target.value)}
                              className="w-full px-3.5 py-2 bg-white border border-slate-250 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-900/20 text-slate-900 text-center"
                            />
                          </div>
                          <div>
                            <label className="font-heading font-bold text-[10px] text-slate-500 uppercase tracking-wider block mb-1">CVV</label>
                            <input
                              type="password"
                              required
                              placeholder="***"
                              maxLength={3}
                              value={cardCvv}
                              onChange={(e) => setCardCvv(e.target.value)}
                              className="w-full px-3.5 py-2 bg-white border border-slate-250 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-900/20 text-slate-900 text-center"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {paymentMethod === "netbanking" && (
                      <div className="space-y-3">
                        <label className="font-heading font-bold text-[10px] text-slate-500 uppercase tracking-wider block">Select Bank</label>
                        <select
                          value={selectedBank}
                          onChange={(e) => setSelectedBank(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-white border border-slate-250 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-900/20 text-slate-900"
                        >
                          <option value="SBI">State Bank of India (SBI)</option>
                          <option value="HDFC">HDFC Bank</option>
                          <option value="ICICI">ICICI Bank</option>
                          <option value="AXIS">Axis Bank</option>
                        </select>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={handleConfirmPayment}
                    className="w-full py-3.5 bg-accent-500 hover:bg-accent-600 text-primary-900 font-heading font-bold text-sm rounded-xl transition-all shadow-md cursor-pointer border-2 border-primary-900/10 flex items-center justify-center gap-1.5"
                  >
                    <span>Pay Securely ₹{finalAmount}</span>
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-10 space-y-4">
                  <Loader2 className="w-12 h-12 text-primary-900 animate-spin" />
                  <div className="text-center">
                    <h4 className="font-heading font-bold text-sm text-primary-900">Processing Secure Transaction</h4>
                    <p className="font-sans text-xs text-slate-400 mt-1">{processingText}</p>
                  </div>
                  <div className="text-[10px] font-sans text-slate-400 flex items-center gap-1 pt-4 border-t border-slate-100 w-full justify-center">
                    <ShieldCheck className="w-3.5 h-3.5 text-accent-500" /> Powered by Razorpay Sandbox Core
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
