"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Heart, CheckCircle2, ShieldCheck, HelpCircle } from "lucide-react";

export default function DonationPolicyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-surface-100/40 via-white to-surface-100/20 py-16 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-primary-900 font-heading font-semibold text-sm hover:underline mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>

        {/* Hero Header */}
        <div className="text-center mb-12">
          <div className="inline-flex p-3 rounded-full bg-primary-900/10 text-primary-900 mb-4">
            <Heart className="w-8 h-8 text-alert-500 fill-alert-500" />
          </div>
          <h1 className="font-heading font-extrabold text-4xl text-primary-900 leading-tight">
            Donation Policy
          </h1>
          <p className="font-sans text-foreground/60 mt-2">
            Last Updated: May 27, 2026
          </p>
        </div>

        {/* Content Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="yssf-card bg-white p-8 md:p-10 border border-primary-200/40 space-y-8"
        >
          <section className="space-y-3">
            <h2 className="font-heading font-extrabold text-xl text-primary-900 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-accent-500" /> 1. Allocation of Funds
            </h2>
            <p className="font-sans text-sm text-foreground/80 leading-relaxed">
              Youth Sakti Social Foundation is committed to high transparency and efficiency. At least **80% of all public contributions** go directly to campaign field activities (buying saplings, hiring medical staff for blood drives, purchasing study materials). Administration, compliance, and marketing expenses are capped at 20% and audited quarterly.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-heading font-extrabold text-xl text-primary-900 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-accent-500" /> 2. Tax Exemption (Section 80G)
            </h2>
            <p className="font-sans text-sm text-foreground/80 leading-relaxed">
              YSSF holds a valid 80G tax exemption status. When you contribute, you receive an automated 80G tax certificate via email within 48 hours. Ensure you provide your legal name and email address to receive this receipt.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-heading font-extrabold text-xl text-primary-900 flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-accent-500" /> 3. Refunds & Cancellation
            </h2>
            <p className="font-sans text-sm text-foreground/80 leading-relaxed">
              Donations are voluntary contributions for community welfare and are generally non-refundable. However, if a donation was made due to a technical error (e.g. duplicate billing), you can request a refund within 15 days of the transaction by emailing our accounts team.
            </p>
          </section>

          <div className="border-t border-primary-100 pt-6 text-center font-sans text-xs text-foreground/60">
            For billing queries, corporate matches, or refunds, please reach out to{" "}
            <a href="mailto:finance@youthsakti.org" className="underline font-semibold text-primary-900 hover:text-accent-500">
              finance@youthsakti.org
            </a>.
          </div>
        </motion.div>
      </div>
    </div>
  );
}
