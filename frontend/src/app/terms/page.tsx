"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Scale, ShieldAlert, FileCheck } from "lucide-react";

export default function TermsPage() {
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
            <Scale className="w-8 h-8" />
          </div>
          <h1 className="font-heading font-extrabold text-4xl text-primary-900 leading-tight">
            Terms of Service
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
              <FileCheck className="w-5 h-5 text-accent-500" /> 1. Acceptance of Terms
            </h2>
            <p className="font-sans text-sm text-foreground/80 leading-relaxed">
              By accessing and using the Youth Sakti Social Foundation (YSSF) platform, you agree to comply with and be bound by these Terms of Service. If you do not agree to these terms, please refrain from using our services, volunteering, or making donations through this site.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-heading font-extrabold text-xl text-primary-900 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-accent-500" /> 2. Volunteer Code of Conduct
            </h2>
            <p className="font-sans text-sm text-foreground/80 leading-relaxed">
              As a volunteer registered through the YSSF portal, you agree to:
            </p>
            <ul className="list-disc pl-5 font-sans text-sm text-foreground/80 space-y-2">
              <li>Perform assigned tasks safely, respectfully, and in accordance with coordinator instructions.</li>
              <li>Provide accurate emergency contact and personal details during registration.</li>
              <li>Respect the dignity, privacy, and safety of community members, school partners, and fellow volunteers.</li>
              <li>Maintain transparency by reporting any operational discrepancies immediately.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-heading font-extrabold text-xl text-primary-900 flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-accent-500" /> 3. Donation and Tax Exemption
            </h2>
            <p className="font-sans text-sm text-foreground/80 leading-relaxed">
              All financial contributions made through our secure portal are eligible for tax deductions under Section 80G of the Income Tax Act, 1961. Receipts are generated automatically and sent to the email address provided. Donations are non-refundable except in rare cases of technical billing errors.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-heading font-extrabold text-xl text-primary-900 flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-accent-500" /> 4. Platform Modifications
            </h2>
            <p className="font-sans text-sm text-foreground/80 leading-relaxed">
              YSSF reserves the right to modify, suspend, or discontinue any campaign, event registration, or platform feature at any time without prior notice. We encourage volunteers and donors to check our live dashboards and reports for ongoing updates.
            </p>
          </section>

          <div className="border-t border-primary-100 pt-6 text-center font-sans text-xs text-foreground/60">
            For questions regarding these terms, please contact us at{" "}
            <a href="mailto:info@youthsakti.org" className="underline font-semibold text-primary-900 hover:text-accent-500">
              info@youthsakti.org
            </a>.
          </div>
        </motion.div>
      </div>
    </div>
  );
}
