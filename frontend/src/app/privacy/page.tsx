"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Shield, Eye, Lock, RefreshCw } from "lucide-react";

export default function PrivacyPage() {
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
            <Shield className="w-8 h-8" />
          </div>
          <h1 className="font-heading font-extrabold text-4xl text-primary-900 leading-tight">
            Privacy Policy
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
              <Eye className="w-5 h-5 text-accent-500" /> 1. Data Collection and Usage
            </h2>
            <p className="font-sans text-sm text-foreground/80 leading-relaxed">
              Youth Sakti Social Foundation collects only the minimal personal data necessary to orchestrate community campaigns, process donations, and issue Section 80G tax receipts. This includes:
            </p>
            <ul className="list-disc pl-5 font-sans text-sm text-foreground/80 space-y-2">
              <li>**Identity Details:** Name, email address, phone number, and location provided during signup or event registration.</li>
              <li>**Volunteering Data:** Availability, skills, and emergency contact details collected for safety during field operations.</li>
              <li>**Transaction Details:** Donation amounts, payment references, and campaign links.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-heading font-extrabold text-xl text-primary-900 flex items-center gap-2">
              <Lock className="w-5 h-5 text-accent-500" /> 2. Data Protection and Masking
            </h2>
            <p className="font-sans text-sm text-foreground/80 leading-relaxed">
              We respect your privacy. While YSSF prioritizes full financial transparency, we secure donor identities by:
            </p>
            <ul className="list-disc pl-5 font-sans text-sm text-foreground/80 space-y-2">
              <li>Masking PAN card details and donor tax identifiers from public view.</li>
              <li>Publishing only aggregated metrics on our public financial ledgers.</li>
              <li>Encrypting password details using secure, industrial-strength standard bcrypt hashing.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-heading font-extrabold text-xl text-primary-900 flex items-center gap-2">
              <RefreshCw className="w-5 h-5 text-accent-500" /> 3. Data Retention and Rights
            </h2>
            <p className="font-sans text-sm text-foreground/80 leading-relaxed">
              We keep your registration details on file for active coordination. You have the right to inspect, update, or request deletion of your personal data at any time by sending a message to our privacy team.
            </p>
          </section>

          <div className="border-t border-primary-100 pt-6 text-center font-sans text-xs text-foreground/60">
            For data inquiries or deletion requests, please contact us at{" "}
            <a href="mailto:privacy@youthsakti.org" className="underline font-semibold text-primary-900 hover:text-accent-500">
              privacy@youthsakti.org
            </a>.
          </div>
        </motion.div>
      </div>
    </div>
  );
}
